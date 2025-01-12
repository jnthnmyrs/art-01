'use client';

import { useState, useRef, useEffect } from 'react';
import type Konva from 'konva';
import { Line, Point } from './types';
import { BrushStyle } from './types';

export function useDrawingState() {
  const [lines, setLines] = useState<Line[]>([]);
  const [redoStack, setRedoStack] = useState<Line[][]>([]);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [color, setColor] = useState('#000000');
  const [pressureMultiplier, setPressureMultiplier] = useState(10);
  const [brushStyle, setBrushStyle] = useState<BrushStyle>('round');
  const isDrawing = useRef(false);
  const lastPoints = useRef<Point[]>([]);

  // Add global pointer up listener
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDrawing.current) {
        isDrawing.current = false;
        lastPoints.current = [];
      }
    };

    // Listen for both mouseup and pointerup for better coverage
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    
    // Also handle when the window loses focus
    window.addEventListener('blur', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
      window.removeEventListener('blur', handleGlobalPointerUp);
    };
  }, []);

  const handleUndo = () => {
    if (lines.length === 0) return;
    
    const newLines = [...lines];
    const removedLine = newLines.pop()!;
    setLines(newLines);
    setRedoStack([...redoStack, [removedLine]]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const newRedoStack = [...redoStack];
    const linesToRestore = newRedoStack.pop()!;
    setRedoStack(newRedoStack);
    setLines([...lines, ...linesToRestore]);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    isDrawing.current = true;
    const pressure = e.evt.pressure !== 0 ? e.evt.pressure : 1;
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    setRedoStack([]);
    
    const point = { x: pos.x, y: pos.y, pressure };
    lastPoints.current = [point];
    
    setLines(prev => [...prev, {
      points: [point],
      color,
      tool,
      pressureMultiplier,
      brushStyle,
    }]);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;

    const pressure = e.evt.pressure !== 0 ? e.evt.pressure : 1;
    const newPoint = { x: point.x, y: point.y, pressure };
    
    // Add new point to our points array
    const currentPoints = [...lastPoints.current, newPoint];
    
    // Update the current line
    const newLines = [...lines];
    newLines[newLines.length - 1] = {
      ...newLines[newLines.length - 1],
      points: currentPoints
    };
    
    setLines(newLines);
    lastPoints.current = currentPoints;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    lastPoints.current = [];
  };

  const handleClear = () => {
    setLines([]);
    setRedoStack([]);
  };

  return {
    lines,
    tool,
    color,
    pressureMultiplier,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setTool,
    setColor,
    setPressureMultiplier,
    handleClear,
    handleUndo,
    handleRedo,
    canUndo: lines.length > 0,
    canRedo: redoStack.length > 0,
    brushStyle,
    setBrushStyle,
  };
} 