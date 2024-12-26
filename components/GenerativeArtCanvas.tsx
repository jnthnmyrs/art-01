'use client';

import { useEffect, useRef } from 'react';

interface GenerativeArtCanvasProps {
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
}

export default function GenerativeArtCanvas({ 
  width = 800, 
  height = 800 
}: GenerativeArtCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 400, y: 400 });

  const colors = [
    '#002ABF'
  ];

  // Randomly select colors
  const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background initially
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    const animate = () => {
      // Remove the semi-transparent black layer
      // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      // ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Move towards mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 1) {
          particle.dx += (dx / distance) * 0.5;
          particle.dy += (dy / distance) * 0.5;
        }

        // Apply friction
        particle.dx *= 0.95;
        particle.dy *= 0.95;

        // Draw line to new position
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);

        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Draw line to new position
        ctx.lineTo(particle.x, particle.y);
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.stroke();

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    // Initialize single particle
    particlesRef.current = Array.from({ length: 1 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      dx: 0,
      dy: 0,
      color: randomColor(),
      size: Math.random() * 4 + 2
    }));

    animate();
  }, [width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Apply explosive force to each particle
    particlesRef.current.forEach(particle => {
      const dx = particle.x - clickX;
      const dy = particle.y - clickY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize the direction and apply force
      // The closer the particle, the stronger the force
      const force = 20 * (1 / (distance + 1));
      particle.dx += (dx / distance) * force;
      particle.dy += (dy / distance) * force;
      
      // Optionally change colors on explosion
      particle.color = randomColor();
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded-lg"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    />
  );
} 