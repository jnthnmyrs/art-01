import { memo } from 'react';
import type { VectorStroke, VectorSegment } from './types';

interface VectorStrokePathProps {
  stroke: VectorStroke;
}

const createPathData = (segment: VectorSegment) => 
  `M ${segment.start.x} ${segment.start.y} 
   C ${segment.controlPoint1.x} ${segment.controlPoint1.y},
     ${segment.controlPoint2.x} ${segment.controlPoint2.y},
     ${segment.end.x} ${segment.end.y}`;

function VectorStrokePathComponent({ stroke }: VectorStrokePathProps) {
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

export const VectorStrokePath = memo(VectorStrokePathComponent); 