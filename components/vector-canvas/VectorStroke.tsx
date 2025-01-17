import { memo } from 'react';
import type { VectorStroke as VectorStrokeType, VectorSegment } from './types';

interface VectorStrokeProps {
  stroke: VectorStrokeType;
}

// Helper function to generate SVG path data
const createPathData = (segment: VectorSegment) => 
  `M ${segment.start.x} ${segment.start.y} 
   C ${segment.controlPoint1.x} ${segment.controlPoint1.y},
     ${segment.controlPoint2.x} ${segment.controlPoint2.y},
     ${segment.end.x} ${segment.end.y}`;

function VectorStrokeComponent({ stroke }: VectorStrokeProps) {
  return (
    <g>
      {stroke.segments.map((segment, i) => (
        <path
          key={i}
          d={createPathData(segment)}
          stroke={stroke.color}
          strokeWidth={segment.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

// Memoize the component to prevent re-renders when props haven't changed
export const VectorStroke = memo(VectorStrokeComponent); 