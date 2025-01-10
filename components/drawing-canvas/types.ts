export interface Point {
  x: number;
  y: number;
  pressure?: number;
  cp1x?: number;
  cp1y?: number;
  cp2x?: number;
  cp2y?: number;
}

export type BrushStyle = 'round' | 'flat';

export interface Line {
  points: Point[];
  color: string;
  tool: 'brush' | 'eraser';
  pressureMultiplier: number;
  brushStyle: BrushStyle;
} 