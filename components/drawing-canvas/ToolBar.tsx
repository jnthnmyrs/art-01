"use client";

import {
  Brush,
  Eraser,
  Undo2,
  Redo2,
  Save,
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
  { value: 5, label: "Tiny", iconSize: 2 },
  { value: 10, label: "Small", iconSize: 4 },
  { value: 25, label: "Medium", iconSize: 6 },
  { value: 50, label: "Large", iconSize: 12 },
  { value: 100, label: "Extra Large", iconSize: 20 },
  { value: 200, label: "Huge", iconSize: 24 },
  { value: 400, label: "Massive", iconSize: 28 },
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
    <>
      {/* Main Toolbar */}
      <div className="absolute -top-48 sm:-top-8 md:-top-16 left-4 lg:top-1/2 lg:-translate-y-1/2 lg:-left-12 z-10">
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
              {BRUSH_SIZES.map(({ value, label, iconSize }) => (
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
                          width: iconSize,
                          height: iconSize,
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

            {/* Show ColorPicker only on mobile */}
            <div className="flex lg:hidden flex-row items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
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
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Drawwwing</p>
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

      {/* Desktop Color Picker */}
      <div className="hidden lg:block absolute top-4 -right-10 z-10">
        <div className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
          <ColorPicker 
            selectedColor={color} 
            onColorChange={onColorChange}
          />
        </div>
      </div>

      {/* Mobile actions and clear button */}
      <div className="flex flex-row absolute bottom-4 bg-red-500 lg:hidden items-center gap-2 p-2  backdrop-blur rounded-lg shadow-sm">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={onUndo}>
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl/⌘ + Z)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" onClick={onRedo}>
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
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Drawwwing</p>
          </TooltipContent>
        </Tooltip>

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
        </TooltipProvider>
      </div>
    </>
  );
}
