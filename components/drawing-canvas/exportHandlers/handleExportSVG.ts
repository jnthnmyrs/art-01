import type { StageRef, ShowToast } from './types';
import { exportStageSVG } from "react-konva-to-svg";
import { track } from "@vercel/analytics";

export const handleExportSVG = async (stageRef: StageRef, showToast: ShowToast) => {
  const stage = stageRef.current;
  if (!stage) {
    console.error("No stage ref found");
    showToast({
      title: "Export failed",
      description: "Could not find canvas to export",
      variant: "destructive",
      duration: 3000,
    });
    return;
  }

  try {
    const svgString = await exportStageSVG(stage, false);
    
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
    console.error("Error exporting SVG:", error);
    showToast({
      title: "Export failed",
      description: "There was an error exporting your drawing.",
      variant: "destructive",
      duration: 3000,
    });
  }
}; 