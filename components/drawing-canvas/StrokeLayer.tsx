'use client';

import { Shape } from 'react-konva';
import { LineData, Point } from './types';

interface StrokeLayerProps {
  lines: LineData[];
}

interface OutlinePoint {
  x: number;
  y: number;
}

const generateStrokeOutline = (points: Point[], pressureMultiplier: number): OutlinePoint[] => {
  if (points.length < 2) return [];
  
  const outline: OutlinePoint[] = [];
  
  // Generate top edge
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    if (next) {
      const angle = Math.atan2(next.y - curr.y, next.x - curr.x);
      const width = pressureMultiplier * (curr.pressure || 1) / 2;
      
      const nx = Math.cos(angle - Math.PI / 2) * width;
      const ny = Math.sin(angle - Math.PI / 2) * width;
      
      outline.push({ x: curr.x + nx, y: curr.y + ny });
    }
  }
  
  // Add the last point's top edge
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  if (prev) {
    const angle = Math.atan2(last.y - prev.y, last.x - prev.x);
    const width = pressureMultiplier * (last.pressure || 1) / 2;
    
    const nx = Math.cos(angle - Math.PI / 2) * width;
    const ny = Math.sin(angle - Math.PI / 2) * width;
    
    outline.push({ x: last.x + nx, y: last.y + ny });
  }
  
  // Generate bottom edge in reverse
  for (let i = points.length - 1; i >= 0; i--) {
    const curr = points[i];
    const prev = points[i - 1];
    
    if (prev) {
      const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x);
      const width = pressureMultiplier * (curr.pressure || 1) / 2;
      
      const nx = Math.cos(angle - Math.PI / 2) * width;
      const ny = Math.sin(angle - Math.PI / 2) * width;
      
      outline.push({ x: curr.x - nx, y: curr.y - ny });
    }
  }
  
  return outline;
};

export function StrokeLayer({ lines }: StrokeLayerProps) {
  return (
    <>
      {lines.map((line, i) => (
        <Shape
          key={i}
          sceneFunc={(context, shape) => {
            const outline = generateStrokeOutline(line.points, line.pressureMultiplier);
            if (outline.length < 2) return;

            context.beginPath();
            context.globalCompositeOperation = 
              line.tool === 'eraser' ? 'destination-out' : 'source-over';
            
            context.moveTo(outline[0].x, outline[0].y);
            for (let i = 1; i < outline.length; i++) {
              context.lineTo(outline[i].x, outline[i].y);
            }
            
            context.closePath();
            context.fillStrokeShape(shape);
          }}
          fill={line.tool === 'eraser' ? 'white' : line.color}
        />
      ))}
    </>
  );
} 