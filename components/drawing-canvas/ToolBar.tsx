"use client";

import { Brush, Eraser, Undo2, Redo2, Trash2, Download,  FileImage, Tangent,  } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorPicker } from "./ColorPicker";
import { BrushStyle } from "./types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


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
  isMain: boolean;
  exportFormat: 'png' | 'svg';
  onExportFormatChange: (format: 'png' | 'svg') => void;
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
  isMain,
  exportFormat,
  onExportFormatChange,
}: ToolBarProps) {
  return (
    <>
      {isMain ? (
        <>
          <div className="flex flex-wrap lg:flex-col gap-4 p-2">
            {/* Tools Group */}

            <div className=" flex flex-row lg:flex-col w-fit items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
              <TooltipProvider>
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
              </TooltipProvider>
            </div>

            {/* Size Buttons */}
            <div className=" flex flex-row lg:flex-col w-fit items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
              <TooltipProvider>
                {BRUSH_SIZES.map(({ value, label, iconSize }) => (
                  <Tooltip key={value}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant={
                          pressureMultiplier === value ? "default" : "ghost"
                        }
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
              </TooltipProvider>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex lg:flex-col gap-2 py-2">
            {/* Desktop Color Picker */}

              <div className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm flex items-center justify-center">
                <ColorPicker
                  selectedColor={color}
                  onColorChange={onColorChange}
                />
              </div>


            {/* Actions Group */}
            <div className="flex flex-row lg:flex-col lg:justify-between w-fit items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
              <TooltipProvider>
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

                
              </TooltipProvider>
            </div>

            <div className="flex flex-row lg:flex-col lg:justify-between w-fit items-center gap-1 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
                  <TooltipProvider>
                    {/* Format Selection Dropdown */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="outline">
                              {exportFormat === 'png' ? (
                                <FileImage className="h-4 w-4" />
                              ) : (
                                <Tangent className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onExportFormatChange('png')}>
                              <FileImage className="mr-2 h-4 w-4" />
                              <span className="text-xs">PNG {exportFormat === 'png' && '✓'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={true} onClick={() => onExportFormatChange('svg')} className="disabled:opacity-50">
                              <Tangent className="mr-2 h-4 w-4" />
                              <span className="text-xs">SVG {exportFormat === 'svg' && '✓'} (Coming Soon)</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TooltipTrigger>
                      <TooltipContent>
                        Export Format
                      </TooltipContent>
                    </Tooltip>

                    {/* Download Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" variant="outline" onClick={onExport}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Save Drawing (Ctrl/⌘ + Shift + S)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>


            {/* Clear Button */}
            <div className="flex flex-row lg:flex-col w-fit items-center gap-2 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="destructive" onClick={onClear}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear Canvas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </>
      )}
    </>
  );
}
