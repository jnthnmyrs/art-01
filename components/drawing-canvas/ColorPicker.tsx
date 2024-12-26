'use client';

import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { COLORS } from "./Colors";


interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}



type ColorName = keyof typeof COLORS;

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const [selectedFamily, setSelectedFamily] = useState<ColorName | null>(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <div 
            className="w-5 h-5 rounded-md border border-gray-200"
            style={{ backgroundColor: selectedColor }}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[320px] p-3">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(COLORS).map(([colorName, shades]) => (
            <div key={colorName} className="space-y-1">
              <button
                className={cn(
                  "w-full group flex flex-col items-center gap-1",
                  "focus:outline-none"
                )}
                onClick={() => setSelectedFamily(colorName as ColorName)}
              >
                <div 
                  className={cn(
                    "w-10 h-10 rounded-md transition-all",
                    selectedFamily === colorName 
                      ? "ring-2 ring-offset-2 ring-gray-400 scale-105" 
                      : "hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-gray-200"
                  )}
                  style={{ backgroundColor: shades[500] }}
                />
                <span className="text-xs text-gray-600 capitalize">
                  {colorName}
                </span>
              </button>
              
              {selectedFamily === colorName && (
                <div className="absolute left-3 right-3 mt-2 p-2 bg-gray-50 shadow-sm border border-gray-200 rounded-md grid grid-cols-11 gap-1">
                  {Object.entries(shades).map(([shade, color]) => (
                    <button
                      key={`${colorName}-${shade}`}
                      className={cn(
                        "w-4 h-4 rounded-sm transition-all",
                        selectedColor === color 
                          ? "ring-2 ring-offset-1 ring-gray-400 scale-110" 
                          : "hover:scale-105 hover:ring-1 hover:ring-offset-1 hover:ring-gray-200"
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() => onColorChange(color)}
                      title={`${colorName}-${shade}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
} 