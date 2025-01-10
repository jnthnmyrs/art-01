'use client';

import { Shape } from 'react-konva';
import { generateStrokeOutline } from './generateStrokeOutline';
import type { Line as LineType } from './types';

interface StrokeLayerProps {
  lines: LineType[];
}

export default function StrokeLayer({ lines }: StrokeLayerProps) {
  return (
    <>
      {lines.map((line, i) => {
        if (!line?.points?.length) return null;
        
        const points = generateStrokeOutline(
          line.points, 
          line.pressureMultiplier,
          // line.brushStyle
        );
        
        if (!points?.length) return null;
        
        return (
          <Shape
            key={i}
            sceneFunc={(context) => {
              context.beginPath();
              
              const firstPoint = points[0];
              if (!firstPoint) return;
              
              context.moveTo(firstPoint.x, firstPoint.y);
              
              for (let i = 1; i < points.length; i++) {
                const curr = points[i];
                const prev = points[i - 1];
                
                if (!curr || !prev) continue;
                
                if (curr.cp1x !== undefined && curr.cp1y !== undefined) {
                  context.bezierCurveTo(
                    prev.cp1x ?? prev.x,
                    prev.cp1y ?? prev.y,
                    curr.cp1x ?? curr.x,
                    curr.cp1y ?? curr.y,
                    curr.x,
                    curr.y
                  );
                } else {
                  context.lineTo(curr.x, curr.y);
                }
              }
              
              context.closePath();
              context.fillStyle = line.color;
              context.fill();
            }}
            fill={line.color}
            globalCompositeOperation={
              line.tool === 'eraser' ? 'destination-out' : 'source-over'
            }
          />
        );
      })}
    </>
  );
} 