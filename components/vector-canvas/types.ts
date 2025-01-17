export interface VectorPoint {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;  // For velocity calculations
}

export interface ControlPoint {
  x: number;
  y: number;
}

export interface VectorSegment {
  start: VectorPoint;
  end: VectorPoint;
  controlPoint1: ControlPoint;
  controlPoint2: ControlPoint;
  width: number;
}

export interface VectorStroke {
  id: string;
  segments: VectorSegment[];
  color: string;
  tool: 'brush' | 'eraser';
} 

