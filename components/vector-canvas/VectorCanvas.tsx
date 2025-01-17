"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import type { VectorPoint, VectorSegment, VectorStroke } from "./types";
import { generateBezierSegments, SmoothingOptions } from "./generateBezier";
import { VectorStrokePath } from "./VectorStrokePath";
import { Button } from "@/components/ui/button";

interface VectorCanvasProps {
  width?: number;
  height?: number;
}

type Tool = 'brush' | 'eraser';

function checkIntersection(stroke1: VectorSegment, stroke2: VectorSegment): boolean {
  // Simple bounding box check for performance
  const margin = (stroke1.width + stroke2.width) / 2;
  
  const box1 = {
    left: Math.min(stroke1.start.x, stroke1.end.x) - margin,
    right: Math.max(stroke1.start.x, stroke1.end.x) + margin,
    top: Math.min(stroke1.start.y, stroke1.end.y) - margin,
    bottom: Math.max(stroke1.start.y, stroke1.end.y) + margin,
  };
  
  const box2 = {
    left: Math.min(stroke2.start.x, stroke2.end.x) - margin,
    right: Math.max(stroke2.start.x, stroke2.end.x) + margin,
    top: Math.min(stroke2.start.y, stroke2.end.y) - margin,
    bottom: Math.max(stroke2.start.y, stroke2.end.y) + margin,
  };
  
  return !(
    box1.right < box2.left ||
    box1.left > box2.right ||
    box1.bottom < box2.top ||
    box1.top > box2.bottom
  );
}

export function VectorCanvas({ width = 750, height = 750 }: VectorCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [strokes, setStrokes] = useState<VectorStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<VectorPoint[]>([]);
  const isDrawing = useRef(false);
  const lastPoint = useRef<VectorPoint | null>(null);
  const rafRef = useRef<number | null>(null);
  const [smoothingOptions, setSmoothingOptions] = useState<
    Partial<SmoothingOptions>
  >({
    smoothing: 1,
    streamline: 1,
    // velocityWeight: 1,
    pressureWeight: 1,
  });
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [eraserStrokes, setEraserStrokes] = useState<VectorStroke[]>([]);

  // Throttle point collection for performance
  const addPoint = useCallback((point: VectorPoint) => {
    const MINIMUM_DISTANCE = 2; // Pixels
    const MINIMUM_TIME = 16; // ms (roughly 60fps)

    if (lastPoint.current) {
      const dx = point.x - lastPoint.current.x;
      const dy = point.y - lastPoint.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const timeDelta = point.timestamp - lastPoint.current.timestamp;

      // Skip points that are too close or too soon
      if (distance < MINIMUM_DISTANCE || timeDelta < MINIMUM_TIME) {
        return;
      }
    }

    lastPoint.current = point;
    setCurrentStroke((prev) => [...prev, point]);
  }, []);

  // Memoize segments generation with a limit on points
  const currentSegments = useMemo(() => {
    if (currentStroke.length < 2) return [];
    const pointsToProcess = currentStroke.slice(-50);
    return generateBezierSegments(pointsToProcess, smoothingOptions);
  }, [currentStroke, smoothingOptions]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDrawing.current = true;
    lastPoint.current = null;
    const point: VectorPoint = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      pressure: e.pressure > 0 ? e.pressure : 0.5,
      timestamp: Date.now(),
    };
    setCurrentStroke([point]);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing.current) return;

      // Cancel any pending frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Schedule point addition on next frame
      rafRef.current = requestAnimationFrame(() => {
        const point: VectorPoint = {
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          pressure: e.pressure > 0 ? e.pressure : lastPoint.current?.pressure ?? 0.5,
          timestamp: Date.now(),
        };
        addPoint(point);
      });
    },
    [addPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDrawing.current || currentStroke.length < 2) return;

    const segments = generateBezierSegments(currentStroke);
    
    if (currentTool === 'brush') {
      const newStroke: VectorStroke = {
        id: Date.now().toString(),
        segments,
        color: "#000000",
        tool: 'brush',
      };
      setStrokes(prev => [...prev, newStroke]);
    } else {
      // Eraser: Remove or split affected strokes
      setStrokes(prev => {
        return prev.filter(stroke => {
          // Check if any segment of this stroke intersects with eraser
          const hasIntersection = stroke.segments.some(strokeSegment =>
            segments.some(eraserSegment =>
              checkIntersection(strokeSegment, eraserSegment)
            )
          );
          
          // Keep strokes that don't intersect with eraser
          return !hasIntersection;
        });
      });
    }

    setCurrentStroke([]);
    isDrawing.current = false;
    lastPoint.current = null;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
  }, [currentStroke, currentTool]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleExportSVG = useCallback(() => {
    if (!svgRef.current) return;

    const cleanSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cleanSvg.setAttribute('width', width.toString());
    cleanSvg.setAttribute('height', height.toString());
    cleanSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    
    // Add defs with mask
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const mask = document.createElementNS('http://www.w3.org/2000/svg', 'mask');
    mask.setAttribute('id', 'export-eraser-mask');
    
    // Add white background to mask
    const maskRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    maskRect.setAttribute('width', width.toString());
    maskRect.setAttribute('height', height.toString());
    maskRect.setAttribute('fill', 'white');
    mask.appendChild(maskRect);
    
    // Add black eraser strokes to mask
    eraserStrokes.forEach(stroke => {
      stroke.segments.forEach(segment => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${segment.start.x} ${segment.start.y} 
          C ${segment.controlPoint1.x} ${segment.controlPoint1.y},
            ${segment.controlPoint2.x} ${segment.controlPoint2.y},
            ${segment.end.x} ${segment.end.y}`);
        path.setAttribute('stroke', 'black');
        path.setAttribute('stroke-width', (segment.width * 1.2).toString());
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        mask.appendChild(path);
      });
    });
    
    defs.appendChild(mask);
    cleanSvg.appendChild(defs);
    
    // Add strokes with mask
    const mainGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    mainGroup.setAttribute('mask', 'url(#export-eraser-mask)');
    
    strokes.forEach(stroke => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      stroke.segments.forEach(segment => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${segment.start.x} ${segment.start.y} 
          C ${segment.controlPoint1.x} ${segment.controlPoint1.y},
            ${segment.controlPoint2.x} ${segment.controlPoint2.y},
            ${segment.end.x} ${segment.end.y}`);
        path.setAttribute('stroke', stroke.color);
        path.setAttribute('stroke-width', segment.width.toString());
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        g.appendChild(path);
      });
      
      mainGroup.appendChild(g);
    });
    
    cleanSvg.appendChild(mainGroup);

    // Convert to SVG string with proper XML declaration
    const svgString = new XMLSerializer().serializeToString(cleanSvg);
    const svgBlob = new Blob([
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n',
      svgString
    ], { type: 'image/svg+xml;charset=utf-8' });

    // Create download link
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vector-drawing-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [strokes, eraserStrokes, width, height]);

  return (
    <div className="relative border aspect-square max-w-[750px] max-h-[750px] mx-auto border-gray-200 rounded-lg bg-white">
      {/* Tool selection */}
      <div className="absolute top-4 left-4 z-10 space-x-2">
        <Button
          onClick={() => setCurrentTool('brush')}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentTool === 'brush' 
              ? 'bg-black text-white' 
              : 'bg-white text-black border border-gray-200'
          }`}
        >
          Brush
        </Button>
        <Button
          onClick={() => setCurrentTool('eraser')}
          className={`px-4 py-2 rounded-md transition-colors ${
            currentTool === 'eraser' 
              ? 'bg-black text-white' 
              : 'bg-white text-black border border-gray-200'
          }`}
        >
          Eraser
        </Button>

      
        {/* Export SVG button */}
        <Button onClick={handleExportSVG}>Export SVG</Button> 
      </div>

      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <defs>
          {/* Create a mask for eraser strokes */}
          <mask id="eraser-mask">
            {/* White background means fully visible */}
            <rect width={width} height={height} fill="white" />
            
            {/* Black eraser strokes create holes */}
            {eraserStrokes.map(stroke => (
              <g key={stroke.id}>
                {stroke.segments.map((segment, i) => (
                  <path
                    key={i}
                    d={`M ${segment.start.x} ${segment.start.y} 
                        C ${segment.controlPoint1.x} ${segment.controlPoint1.y},
                          ${segment.controlPoint2.x} ${segment.controlPoint2.y},
                          ${segment.end.x} ${segment.end.y}`}
                    strokeWidth={segment.width * 1.2}
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            ))}
          </mask>
        </defs>

        {/* Render strokes with mask */}
        <g mask="url(#eraser-mask)">
          {strokes.map((stroke) => (
            <VectorStrokePath key={stroke.id} stroke={stroke} />
          ))}
        </g>

        {/* Current stroke preview */}
        {currentSegments.length > 0 && (
          <g>
            {currentSegments.map((segment, i) => (
              <path
                key={i}
                d={`M ${segment.start.x} ${segment.start.y} 
                    C ${segment.controlPoint1.x} ${segment.controlPoint1.y},
                      ${segment.controlPoint2.x} ${segment.controlPoint2.y},
                      ${segment.end.x} ${segment.end.y}`}
                stroke={currentTool === 'brush' ? "#000000" : "#ff0000"}
                strokeWidth={segment.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: currentTool === 'eraser' ? 0.5 : 1 }}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
