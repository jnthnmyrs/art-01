'use client';

import { Stage, Layer, Shape } from 'react-konva';
import { useState, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type Konva from 'konva';
import { Eraser, Brush, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KonvaCanvasProps {
  width?: number;
  height?: number;
}

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface OutlinePoint {
  x: number;
  y: number;
}

interface LineData {
  points: Point[];
  pressureMultiplier: number;
  tool: 'brush' | 'eraser';
}

const generateStrokeOutline = (points: Point[], pressureMultiplier: number): OutlinePoint[] => {
  if (points.length < 2) return [];
  
  const outline: OutlinePoint[] = [];
  
  // Generate the forward path (top of the stroke)
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const prev = points[i - 1];
    
    if (next) {
      const angle = Math.atan2(next.y - curr.y, next.x - curr.x) - Math.PI / 2;
      const width = pressureMultiplier * (curr.pressure || 1) / 2;
      
      const nx = Math.cos(angle) * width;
      const ny = Math.sin(angle) * width;
      
      outline.push({ x: curr.x + nx, y: curr.y + ny });
    } else if (prev) {
      // Last point - use previous angle
      const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x) - Math.PI / 2;
      const width = pressureMultiplier * (curr.pressure || 1) / 2;
      
      const nx = Math.cos(angle) * width;
      const ny = Math.sin(angle) * width;
      
      outline.push({ x: curr.x + nx, y: curr.y + ny });
    }
  }
  
  // Generate the return path (bottom of the stroke)
  for (let i = points.length - 1; i >= 0; i--) {
    const curr = points[i];
    const next = points[i - 1];
    const prev = points[i + 1];
    
    if (next) {
      const angle = Math.atan2(next.y - curr.y, next.x - curr.x) - Math.PI / 2;
      const width = pressureMultiplier * (curr.pressure || 1) / 2;
      
      const nx = Math.cos(angle) * width;
      const ny = Math.sin(angle) * width;
      
      outline.push({ x: curr.x - nx, y: curr.y - ny });
    } else if (prev) {
      // First point - use previous angle
      const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x) - Math.PI / 2;
      const width = pressureMultiplier * (curr.pressure || 1) / 2;
      
      const nx = Math.cos(angle) * width;
      const ny = Math.sin(angle) * width;
      
      outline.push({ x: curr.x - nx, y: curr.y - ny });
    }
  }
  
  return outline;
};

export default function KonvaCanvas({ width = 800, height = 800 }: KonvaCanvasProps) {
  const { toast } = useToast();
  const [lines, setLines] = useState<LineData[]>([]);
  const [pressureMultiplier, setPressureMultiplier] = useState(10);
  // const [smoothness, setSmoothness] = useState(0.5);
  const [redoStack, setRedoStack] = useState<LineData[][]>([]);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const isDrawing = useRef(false);
  const lastPoints = useRef<Point[]>([]);
  const stageRef = useRef<Konva.Stage>(null);

  const handleMouseDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    isDrawing.current = true;
    const pressure = e.evt.pressure !== 0 ? e.evt.pressure : 1;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setRedoStack([]);
    
    const point = { x: pos.x, y: pos.y, pressure };
    lastPoints.current = [point];
    
    setLines([...lines, { 
      points: [point],
      pressureMultiplier,
      tool
    }]);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const pressure = e.evt.pressure !== 0 ? e.evt.pressure : 1;
    const newPoint = { x: point.x, y: point.y, pressure };
    
    // Add new point to our points array
    const currentPoints = [...lastPoints.current, newPoint];
    
    // Update the current line
    const newLines = [...lines];
    newLines[newLines.length - 1] = {
      ...newLines[newLines.length - 1],
      points: currentPoints
    };
    
    setLines(newLines);
    lastPoints.current = currentPoints;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    lastPoints.current = [];
  };

  const handleClear = () => {
    setLines([]);
    setRedoStack([]);
  };

  return (
    <div className="relative border border-gray-200 rounded-lg">
      <div className="absolute top-4 left-4 flex gap-2 z-10 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`p-2 rounded-md transition-colors ${
                  tool === 'brush' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setTool('brush')}
              >
                <Brush className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Brush (B)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={`p-2 rounded-md transition-colors ${
                  tool === 'eraser' 
                    ? 'bg-blue-500 text-white shadow-sm' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setTool('eraser')}
              >
                <Eraser className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser (E)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md bg-red-100 hover:bg-red-200 transition-colors"
                onClick={handleClear}
              >
                <Trash className="w-5 h-5 text-red-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-4 z-10 p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm w-64">
        <div className="space-y-2">
          <div className="text-sm">Line Thickness: {pressureMultiplier}</div>
          <Slider 
            value={[pressureMultiplier]}
            onValueChange={([value]) => setPressureMultiplier(value)}
            max={50}
            step={1}
          />
        </div>
        {/* <div className="space-y-2">
          <div className="text-sm">Smoothness: {smoothness}</div>
          <Slider
            value={[smoothness]}
            onValueChange={([value]) => setSmoothness(value)}
            max={1}
            step={0.1}
          />
        </div> */}
      </div>

      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onPointerDown={handleMouseDown}
        onPointerMove={handleMouseMove}
        onPointerUp={handleMouseUp}
        className="border border-gray-200 rounded-lg bg-white"
      >
        <Layer>
          {lines.map((line, i) => (
            <Shape
              key={i}
              sceneFunc={(context, shape) => {
                const outline = generateStrokeOutline(line.points, line.pressureMultiplier);
                if (outline.length < 2) return;

                context.beginPath();
                context.globalCompositeOperation = 
                  line.tool === 'eraser' ? 'destination-out' : 'source-over';
                
                // Draw the outline
                context.moveTo(outline[0].x, outline[0].y);
                for (let i = 1; i < outline.length; i++) {
                  context.lineTo(outline[i].x, outline[i].y);
                }
                
                // Close the path and fill
                context.closePath();
                context.fillStrokeShape(shape);
              }}
              fill={line.tool === 'eraser' ? 'white' : 'black'}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
} 