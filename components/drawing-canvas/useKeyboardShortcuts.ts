'use client';

import { useEffect } from 'react';

interface KeyboardShortcutProps {
  onUndo: () => void;
  onRedo: () => void;
  setTool: (tool: 'brush' | 'eraser') => void;
  setPressureMultiplier: (value: number) => void;
}

export function useKeyboardShortcuts({ 
  onUndo, 
  onRedo, 
  setTool,
  setPressureMultiplier 
}: KeyboardShortcutProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Undo: Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }

      // Redo: Cmd/Ctrl + Shift + Z
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault();
        onRedo();
      }

      // Tool shortcuts (without modifiers)
      if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            setTool('brush');
            break;
          case 'e':
            setTool('eraser');
            break;
          case '1':
            setPressureMultiplier(5); // Small
            break;
          case '2':
            setPressureMultiplier(25); // Medium
            break;
          case '3':
            setPressureMultiplier(50); // Large
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, setTool, setPressureMultiplier]);
} 