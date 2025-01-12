'use client';

import { useEffect } from 'react';
import { useEyeDropper } from './ColorPicker';

interface KeyboardShortcutProps {
  onUndo: () => void;
  onRedo: () => void;
  setTool: (tool: 'brush' | 'eraser') => void;
  setPressureMultiplier: (value: number) => void;
  pressureMultiplier: number;
  onColorChange: (color: string) => void;
}

const BRUSH_SIZES = [
  { value: 5, label: "Tiny", iconSize: 10 },
  { value: 10, label: "Small", iconSize: 15 },
  { value: 25, label: "Medium", iconSize: 20 },
  { value: 50, label: "Large", iconSize: 25 },
  { value: 100, label: "Extra Large", iconSize: 30 },
  { value: 200, label: "Huge", iconSize: 35 },
  { value: 400, label: "Massive", iconSize: 40 },
] as const;

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  setTool,
  setPressureMultiplier,
  pressureMultiplier,
  onColorChange,
}: KeyboardShortcutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'b') {
        setTool('brush');
      } else if (e.key === 'e') {
        setTool('eraser');
      } else if (e.key === 'i') {
        useEyeDropper(onColorChange);
      } else if (e.key === '[' || e.key === ']') {
        // Find current size index
        const currentIndex = BRUSH_SIZES.findIndex(
          size => size.value === pressureMultiplier
        );
        
        if (currentIndex === -1) return;

        // Decrease size with [, increase with ]
        const newIndex = e.key === '[' 
          ? Math.max(0, currentIndex - 1)
          : Math.min(BRUSH_SIZES.length - 1, currentIndex + 1);

        setPressureMultiplier(BRUSH_SIZES[newIndex].value);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          onRedo();
        } else {
          e.preventDefault();
          onUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, setTool, setPressureMultiplier, pressureMultiplier, onColorChange]);
} 