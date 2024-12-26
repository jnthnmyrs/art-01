'use client';

import { Brush, Eraser, Undo, Redo, Download, Trash2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorPicker } from './ColorPicker';
import { cn } from "@/lib/utils";

interface ToolBarProps {
  tool: 'brush' | 'eraser';
  color: string;
  pressureMultiplier: number;
  onToolChange: (tool: 'brush' | 'eraser') => void;
  onColorChange: (color: string) => void;
  onPressureMultiplierChange: (value: number) => void;
  onClear: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BRUSH_SIZES = [
  { value: 5, label: 'Small' },
  { value: 25, label: 'Medium' },
  { value: 50, label: 'Large' },
] as const;

export function ToolBar({
  tool,
  color,
  pressureMultiplier,
  onToolChange,
  onColorChange,
  onPressureMultiplierChange,
  onClear,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolBarProps) {
  return (
    <div className=" px-0 lg:px-4 flex flex-wrap justify-between lg:justify-center w-full max-w-[800px] mx-auto items-center gap-2 lg:gap-4 z-10 mb-4">
      <TooltipProvider>
        {/* Tools Group */}
        <div className="flex lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  tool === 'brush' ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                )}
                onClick={() => onToolChange('brush')}
              >
                <Brush className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Brush (B)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  tool === 'eraser' ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                )}
                onClick={() => onToolChange('eraser')}
              >
                <Eraser className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser (E)</p>
            </TooltipContent>
          </Tooltip>

          <ColorPicker 
            selectedColor={color}
            onColorChange={onColorChange}
          />
        </div>

        {/* Size Buttons */}
        <div className="flex lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
          {BRUSH_SIZES.map(({ value, label }) => (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "w-8 h-8 rounded-md transition-colors",
                    pressureMultiplier === value 
                      ? "bg-blue-100 text-blue-600" 
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => onPressureMultiplierChange(value)}
                >
                  <div 
                    className="mx-auto rounded-full bg-current"
                    style={{ 
                      width: Math.max(4, value * 0.35), 
                      height: Math.max(4, value * 0.35) 
                    }} 
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* History/Export Group */}
        <div className="flex lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  !canUndo && "opacity-50 cursor-not-allowed",
                  canUndo && "hover:bg-gray-100"
                )}
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo (⌘Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn(
                  "p-2 rounded-md transition-colors",
                  !canRedo && "opacity-50 cursor-not-allowed",
                  canRedo && "hover:bg-gray-100"
                )}
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo (⌘⇧Z)</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={onExport}
              >
                <Download className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export (⌘S)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Delete Button - Far Right */}
      <div className="">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="p-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                onClick={onClear}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
} 