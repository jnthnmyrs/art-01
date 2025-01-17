import type { VectorPoint, VectorSegment, ControlPoint } from './types';

export interface SmoothingOptions {
  smoothing: number;
  pressureWeight: number;
  streamline: number;
}

const DEFAULT_OPTIONS: SmoothingOptions = {
  smoothing: 1,
  pressureWeight: 1,
  streamline: 1,
};

const SMOOTHING_STEPS = 20;

// Catmull-Rom spline calculation
function getCatmullRomPoint(
  p0: VectorPoint,
  p1: VectorPoint,
  p2: VectorPoint,
  p3: VectorPoint,
  t: number,
  alpha: number = 0.5
): { x: number; y: number } {
  const t2 = t * t;
  const t3 = t2 * t;

  // Catmull-Rom matrix
  const m0 = (-alpha * t3) + (2 * alpha * t2) - (alpha * t);
  const m1 = ((2 - alpha) * t3) + ((alpha - 3) * t2) + 1;
  const m2 = ((alpha - 2) * t3) + ((3 - 2 * alpha) * t2) + (alpha * t);
  const m3 = (alpha * t3) - (alpha * t2);

  return {
    x: m0 * p0.x + m1 * p1.x + m2 * p2.x + m3 * p3.x,
    y: m0 * p0.y + m1 * p1.y + m2 * p2.y + m3 * p3.y
  };
}

// Path smoothing with moving average
function smoothPoints(points: VectorPoint[], windowSize: number = 3): VectorPoint[] {
  if (points.length < windowSize) return points;

  const smoothed: VectorPoint[] = [];
  const half = Math.floor(windowSize / 2);

  for (let i = 0; i < points.length; i++) {
    let sumX = 0, sumY = 0, sumPressure = 0;
    let count = 0;

    for (let j = Math.max(0, i - half); j < Math.min(points.length, i + half + 1); j++) {
      // Weight points based on distance from center
      const weight = 1 - Math.abs(i - j) / (half + 1);
      sumX += points[j].x * weight;
      sumY += points[j].y * weight;
      sumPressure += points[j].pressure * weight;
      count += weight;
    }

    smoothed.push({
      x: sumX / count,
      y: sumY / count,
      pressure: sumPressure / count,
      timestamp: points[i].timestamp
    });
  }

  return smoothed;
}

// Add pressure normalization helpers
function normalizePressure(pressure: number, options: SmoothingOptions): number {
  // Convert pressure to a value between 0.2 and 1
  const normalized = Math.max(0.2, Math.min(1, pressure));
  
  // Apply pressure curve for more natural feel
  const curve = Math.pow(normalized, 1.5);
  
  // Scale by pressure weight
  return options.pressureWeight * curve;
}

export function generateBezierSegments(
  points: VectorPoint[],
  options: Partial<SmoothingOptions> = {}
): VectorSegment[] {
  if (points.length < 4) return [];

  const opts = { ...DEFAULT_OPTIONS, ...options };
  const segments: VectorSegment[] = [];

  // First smooth the input points
  const smoothedPoints = smoothPoints(points, 5);

  // Then generate high-quality curves using Catmull-Rom
  for (let i = 0; i < smoothedPoints.length - 3; i++) {
    const p0 = smoothedPoints[i];
    const p1 = smoothedPoints[i + 1];
    const p2 = smoothedPoints[i + 2];
    const p3 = smoothedPoints[i + 3];

    // Generate intermediate points for smoother curves
    const STEPS = SMOOTHING_STEPS;
    for (let step = 0; step < STEPS; step++) {
      const t = step / STEPS;
      const nextT = (step + 1) / STEPS;

      const current = getCatmullRomPoint(p0, p1, p2, p3, t);
      const next = getCatmullRomPoint(p0, p1, p2, p3, nextT);

      // Calculate control points for the Bezier curve
      const dx = next.x - current.x;
      const dy = next.y - current.y;
    //   const distance = Math.sqrt(dx * dx + dy * dy);
      
      const tension = opts.smoothing * 0.2; // Reduced tension
      
      const cp1: ControlPoint = {
        x: current.x + dx * tension,
        y: current.y + dy * tension
      };

      const cp2: ControlPoint = {
        x: next.x - dx * tension,
        y: next.y - dy * tension
      };

      // Interpolate pressure
      const t1 = i + t;
      const pressure = p1.pressure + (p2.pressure - p1.pressure) * t1;
      const width = normalizePressure(pressure, opts) * 8; // Reduced base width multiplier

      segments.push({
        start: { x: current.x, y: current.y, pressure, timestamp: p1.timestamp },
        end: { x: next.x, y: next.y, pressure, timestamp: p2.timestamp },
        controlPoint1: cp1,
        controlPoint2: cp2,
        width
      });
    }
  }

  return segments;
} 