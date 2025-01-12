"use client";

import {
  Brush,
  Eraser,
  Undo2,
  Redo2,
  Download,
  Trash2,

} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorPicker } from "./ColorPicker";

import { BrushStyle } from "./types";
import { Button } from "@/components/ui/button";


interface ToolBarProps {
  tool: "brush" | "eraser";
  color: string;
  pressureMultiplier: number;
  transparentBackground: boolean;
  onToolChange: (tool: "brush" | "eraser") => void;
  onColorChange: (color: string) => void;
  onPressureMultiplierChange: (value: number) => void;
  onTransparentBackgroundChange: (transparent: boolean) => void;
  onClear: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  brushStyle: BrushStyle;
  onBrushStyleChange: (style: BrushStyle) => void;
}

const BRUSH_SIZES = [
  { value: 5, label: "Tiny" },
  { value: 10, label: "Small" },
  { value: 25, label: "Medium" },
  { value: 50, label: "Large" },
  { value: 100, label: "Extra Large" },
  { value: 200, label: "Huge" },
  { value: 400, label: "Massive" },
] as const;

export function ToolBar({
  tool,
  color,
  pressureMultiplier,
  // transparentBackground,
  onToolChange,
  onColorChange,
  onPressureMultiplierChange,
  // onTransparentBackgroundChange,
  onClear,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: ToolBarProps) {
  return (
    <div className="absolute -top-32 sm:-top-8 md:-top-16   left-4 lg:top-1/2 lg:-translate-y-1/2 lg:-left-16 z-10">
      <TooltipProvider>
        <div className="flex flex-wrap lg:flex-col gap-2">
          {/* Tools Group */}
          <div className="flex flex-row lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={tool === "brush" ? "default" : "ghost"}
                  onClick={() => onToolChange("brush")}
                >
                  <Brush className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brush (B)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant={tool === "eraser" ? "default" : "ghost"}
                  onClick={() => onToolChange("eraser")}
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eraser (E)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Size Buttons */}
          <div className="flex flex-row lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            {BRUSH_SIZES.map(({ value, label }, ) => (
              <Tooltip key={value}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={pressureMultiplier === value ? 'default' : 'ghost'}
                    onClick={() => onPressureMultiplierChange(value)}
                    className="w-8 h-8"
                  >
                    <div
                      className="mx-auto rounded-full bg-current"
                      style={{
                        width: Math.max(4, value * 0.08),
                        height: Math.max(4, value * 0.08),
                      }}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Color Picker */}
          <div className="flex flex-row lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <ColorPicker selectedColor={color} onColorChange={onColorChange} />
          </div>

          {/* Actions Group */}
          <div className="flex flex-row lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl/⌘ + Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl/⌘ + Shift + Z)</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Clear Button */}
          <div className="flex flex-row lg:flex-col items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onClear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clear Canvas</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
