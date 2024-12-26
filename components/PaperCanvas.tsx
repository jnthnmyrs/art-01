'use client';

import { useEffect, useRef } from 'react';

interface PaperCanvasProps {
  width?: number;
  height?: number;
}

export default function PaperCanvas({ width = 800, height = 800 }: PaperCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamically import Paper.js only on the client side
    const initPaper = async () => {
      // Try this specific import
      const Paper = (await import('paper')).default;
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Setup Paper.js
      Paper.setup(canvas);
      const { Path, Point, view } = Paper;

      // Create main path
      const mainPath = new Path({
        strokeColor: '#2196F3',
        strokeWidth: 2,
        strokeCap: 'round'
      });

      // Store the last point for velocity calculation
      let lastPoint: paper.Point | null = null;
      let velocity = new Point(0, 0);

      view.onMouseMove = (event: paper.MouseEvent) => {
        // Calculate velocity
        if (lastPoint) {
          velocity = event.point.subtract(lastPoint);
        }
        lastPoint = event.point.clone();

        // Add point to main path
        mainPath.add(event.point);

        // Keep only last 50 segments for performance
        if (mainPath.segments.length > 50) {
          mainPath.removeSegments(0, 1);
        }

        // Create perpendicular lines based on velocity
        const perpendicular = velocity.rotate(90, event.point);
        perpendicular.length = 20;

        // Create decorative paths
        const path1 = new Path({
          segments: [
            event.point.add(perpendicular),
            event.point.subtract(perpendicular)
          ],
          strokeColor: '#E91E63',
          strokeWidth: 1,
          opacity: 0.5
        });

        // Animate and remove the perpendicular lines
        path1.onFrame = () => {
          path1.opacity -= 0.05;
          path1.strokeWidth += 0.2;
          if (path1.opacity <= 0) {
            path1.remove();
          }
        };
      };

      // Add click interaction
      view.onMouseDown = (event: paper.MouseEvent) => {
        // Create a circular burst effect
        const numRays = 12;
        for (let i = 0; i < numRays; i++) {
          const angle = (360 / numRays) * i;
          const ray = new Path({
            segments: [
              event.point,
              event.point.add(new Point(
                Math.cos(angle * (Math.PI / 180)) * 50,
                Math.sin(angle * (Math.PI / 180)) * 50
              ))
            ],
            strokeColor: '#FFC107',
            strokeWidth: 2,
            opacity: 1
          });

          // Animate the rays
          ray.onFrame = () => {
            ray.opacity -= 0.02;
            ray.scale(1.05);
            if (ray.opacity <= 0) {
              ray.remove();
            }
          };
        }
      };

      // Start the animation loop
      view.onFrame = () => {
        // Smooth the main path
        mainPath.smooth();
      };
    };

    initPaper();

    return () => {
      // Cleanup will be handled by Paper.js internal cleanup
    };
  }, [width, height]);

  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded-lg bg-white"
    />
  );
} 