"use client";

import { Brush, Eraser, Undo, Redo, Download, Trash2,  } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorPicker } from "./ColorPicker";
import { cn } from "@/lib/utils";
import { BrushStyle } from "./types";


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
  { value: 5, label: "Small" },
  { value: 25, label: "Medium" },
  { value: 50, label: "Large" },
] as const;

export function ToolBar({
  tool,
  color,
  pressureMultiplier,
  transparentBackground,
  onToolChange,
  onColorChange,
  onPressureMultiplierChange,
  onTransparentBackgroundChange,
  onClear,
  onExport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  brushStyle,
  onBrushStyleChange,
}: ToolBarProps) {
  return (
    <div className=" px-0 lg:px-4 flex flex-wrap justify-evenly lg:justify-center w-full max-w-[800px] mx-auto items-center gap-2 lg:gap-4 z-10 mb-4">
      <TooltipProvider>
        <div className="flex gap-2 w-full">

        
        <div className="flex gap-2 w-full ">
          {/* Tools Group */}
          <div className="flex  items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    tool === "brush"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => onToolChange("brush")}
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
                    tool === "eraser"
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() => onToolChange("eraser")}
                >
                  <Eraser className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Eraser (E)</p>
              </TooltipContent>
            </Tooltip>

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="p-2 rounded-md transition-colors"
                  onClick={() => onBrushStyleChange(brushStyle === 'round' ? 'flat' : 'round')}
                >
                  {brushStyle === 'round' ? (
                    <Circle className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Brush Style</p>
              </TooltipContent>
            </Tooltip> */}

            <ColorPicker selectedColor={color} onColorChange={onColorChange} />
          </div>

          {/* Size Buttons */}
          <div className="flex  items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
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
                        height: Math.max(4, value * 0.35),
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
        </div>

        <div className="flex  gap-2 items-center justify-between w-full">
          {/* History/Export Group */}
          <div className="flex  items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
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
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    transparentBackground
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  )}
                  onClick={() =>
                    onTransparentBackgroundChange(!transparentBackground)
                  }
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2L2 12L12 22L22 12L12 2Z" />
                    {transparentBackground && (
                      <>
                        <path
                          d="M6 12H18"
                          strokeDasharray={
                            transparentBackground ? "1 1" : "2 2"
                          }
                        />
                        <path
                          d="M12 6V18"
                          strokeDasharray={
                            transparentBackground ? "1 1" : "2 2"
                          }
                        />
                      </>
                    )}
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {transparentBackground
                    ? "Transparent Background"
                    : "White Background"}
                </p>
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
                <p>Export</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Delete Button - Far Right */}
          <div className="">
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
          </div>
        </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
