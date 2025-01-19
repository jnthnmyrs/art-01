import type { StageRef, ShowToast } from './types';
import { track } from "@vercel/analytics";
import { Stage as KonvaStage } from 'konva/lib/Stage';
import { Shape as KonvaShape } from 'konva/lib/Shape';
import { generateStrokeOutline } from '../generateStrokeOutline';

export const handleExportSVG = async (stageRef: StageRef, showToast: ShowToast) => {
  try {
    const stage = stageRef.current as KonvaStage;
    if (!stage) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    
    // Basic SVG attributes
    svg.setAttribute("width", stage.width().toString());
    svg.setAttribute("height", stage.height().toString());
    svg.setAttribute("viewBox", `0 0 ${stage.width()} ${stage.height()}`);
    svg.setAttribute("xmlns", svgNS);
    
    // Add metadata
    svg.setAttribute("version", "1.1");
    const title = document.createElementNS(svgNS, "title");
    title.textContent = "Drawwwtime Artwork";
    svg.appendChild(title);
    
    const desc = document.createElementNS(svgNS, "desc");
    desc.textContent = `Created with Drawwwtime on ${new Date().toISOString()}`;
    svg.appendChild(desc);
    
    // Add metadata namespace
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:drawwwtime", "https://drawwwtime.com/ns");
    
    // Add custom metadata
    const metadata = document.createElementNS(svgNS, "metadata");
    const metadataContent = {
      application: "Drawwwtime",
      version: "1.0.0", // Your app version
      created: new Date().toISOString(),
      canvasWidth: stage.width(),
      canvasHeight: stage.height(),
      strokeCount: stage.children[0].children.length,
      // Could add more like color palette used, tools used, etc.
    };
    metadata.textContent = JSON.stringify(metadataContent, null, 2);
    svg.appendChild(metadata);
    
    // Add some helpful attributes for better browser compatibility
    svg.setAttribute("shape-rendering", "geometricPrecision");
    svg.setAttribute("text-rendering", "geometricPrecision");
    svg.setAttribute("style", "background-color: white;"); // Or whatever your canvas background is
    
    // Single group for all content, building up layers
    const mainGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(mainGroup);
    
    // Process each shape in order
    const layer = stage.children[0];
    layer.children.forEach((node) => {
      const shape = node as KonvaShape;
      const { lineData } = shape.attrs;
      if (!lineData?.points?.length) return;

      const points = generateStrokeOutline(
        lineData.points,
        lineData.pressureMultiplier
      );
      
      if (!points?.length) return;
      
      // Create path data
      let pathData = '';
      const firstPoint = points[0];
      if (!firstPoint) return;
      
      pathData = `M ${firstPoint.x} ${firstPoint.y}`;
      
      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i - 1];
        
        if (!curr || !prev) continue;
        
        if (curr.cp1x !== undefined && curr.cp1y !== undefined) {
          pathData += ` C ${prev.cp1x ?? prev.x} ${prev.cp1y ?? prev.y}, ${curr.cp1x ?? curr.x} ${curr.cp1y ?? curr.y}, ${curr.x} ${curr.y}`;
        } else {
          pathData += ` L ${curr.x} ${curr.y}`;
        }
      }
      
      pathData += ' Z';
      
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", pathData);
      
      if (lineData.tool === 'eraser') {
        // Use a clip-path to cut out from previous content
        path.setAttribute("fill", "white");
        path.style.mixBlendMode = "destination-out";
      } else {
        path.setAttribute("fill", lineData.color);
        path.style.mixBlendMode = "source-over";
      }
      
      mainGroup.appendChild(path);
    });

    // Convert to string and download
    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    const random = Math.random().toString(36).substring(2, 8);
    
    link.href = url;
    link.download = `drawwwtime-${date}-${random}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    track("Downloaded SVG drawing");
    showToast({
      title: "SVG saved! 🎨",
      description: "Your vector masterpiece has been downloaded to your computer.",
      duration: 3000,
    });

  } catch (error) {
    console.error("Error in SVG export:", error);
    showToast({
      title: "Export failed",
      description: "There was an error exporting your drawing.",
      variant: "destructive",
      duration: 3000,
    });
  }
}; 