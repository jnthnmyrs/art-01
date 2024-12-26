export interface Point {
  x: number;
  y: number;
  pressure: number;
}

export interface LineData {
  points: Point[];
  pressureMultiplier: number;
  tool: 'brush' | 'eraser';
  color: string;
} 