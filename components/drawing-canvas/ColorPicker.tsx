'use client';

import { useState } from 'react';
import { HexColorPicker } from "react-colorful";
import { Pipette } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

// Change to regular async function instead of a hook
export async function activateEyeDropper(onColorChange: (color: string) => void) {
  if (!('EyeDropper' in window)) {
    console.warn('EyeDropper API is not supported in this browser');
    return;
  }

  try {
    const eyeDropper = new (window as any).EyeDropper();
    const result = await eyeDropper.open();
    onColorChange(result.sRGBHex);
  } catch (e) {
    // User canceled the eye dropper
    console.log('EyeDropper cancelled');
  }
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex lg:flex-col gap-2">
        {/* Current Color Swatch */}
        <button
          className="w-8 h-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ring-2 ring-white"
          style={{ backgroundColor: selectedColor }}
          onClick={() => setShowPicker(!showPicker)}
          title="Open color picker"
        />
        
        {/* Eyedropper Button */}
        {'EyeDropper' in window && (
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => activateEyeDropper(onColorChange)}
            title="Pick color from screen (I)"
          >
            <Pipette className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Color Picker Popover */}
      {showPicker && (
        <div className="absolute left-full ml-2 z-50">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowPicker(false)} 
          />
          <div className="relative bg-white/95 p-2 rounded-lg shadow-lg backdrop-blur-sm">
            <HexColorPicker 
              color={selectedColor}
              onChange={onColorChange}
            />
          </div>
        </div>
      )}
    </div>
  );
} 