import type { Point } from './types';

const interpolatePoints = (p1: Point, p2: Point, numPoints: number): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const pressure = (p1.pressure || 1) + ((p2.pressure || 1) - (p1.pressure || 1)) * t;
    points.push({
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
      pressure
    });
  }
  return points;
};

// Add a function to smooth angles
const smoothAngle = (points: Point[], index: number, windowSize: number = 3): number => {
  const start = Math.max(0, index - windowSize);
  const end = Math.min(points.length - 1, index + windowSize);
  
  let sumX = 0;
  let sumY = 0;
  
  for (let i = start; i < end - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const dx = next.x - curr.x;
    const dy = next.y - curr.y;
    sumX += dx;
    sumY += dy;
  }
  
  return Math.atan2(sumY, sumX);
};

export const generateStrokeOutline = (
  rawPoints: Point[], 
  pressureMultiplier: number,
): Point[] => {
  // Safety check - need at least 2 points to draw a line
  if (!rawPoints?.length || rawPoints.length < 2) return [];
  
  // Step 1: Interpolation
  const maxDistance = 1; // Maximum distance between points
  const interpolatedPoints: Point[] = [];
  
  // Add points between any two points that are too far apart
  for (let i = 0; i < rawPoints.length - 1; i++) {
    const curr = rawPoints[i];
    const next = rawPoints[i + 1];
    const distance = Math.hypot(next.x - curr.x, next.y - curr.y);
    
    interpolatedPoints.push(curr);
    if (distance > maxDistance) {
      const numPoints = Math.ceil(distance / maxDistance);
      interpolatedPoints.push(...interpolatePoints(curr, next, numPoints));
    }
  }
  interpolatedPoints.push(rawPoints[rawPoints.length - 1]);
  
  // Step 2: Generate Outline
  const outline: Point[] = [];
  
  // Left side of the stroke
  for (let i = 0; i < interpolatedPoints.length - 1; i++) {
    const curr = interpolatedPoints[i];
    const angle = smoothAngle(interpolatedPoints, i);
    const width = pressureMultiplier * (curr.pressure || 1) / 2;

    outline.push({
      x: curr.x + Math.cos(angle - Math.PI / 2) * width,
      y: curr.y + Math.sin(angle - Math.PI / 2) * width
    });
  }

  // Right side of the stroke (in reverse)
  for (let i = interpolatedPoints.length - 1; i > 0; i--) {
    const curr = interpolatedPoints[i];
    const angle = smoothAngle(interpolatedPoints, i);
    const width = pressureMultiplier * (curr.pressure || 1) / 2;

    outline.push({
      x: curr.x + Math.cos(angle + Math.PI / 2) * width,
      y: curr.y + Math.sin(angle + Math.PI / 2) * width
    });
  }
  
  return outline;
};