'use client';

import { useState, useEffect } from 'react';
import { HexColorPicker } from "react-colorful";
import { Pipette } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

interface EyeDropperResult {
  sRGBHex: string;
}

interface EyeDropper {
  open: () => Promise<EyeDropperResult>;
}

// Change to regular async function instead of a hook
export async function activateEyeDropper(onColorChange: (color: string) => void) {
  if (!('EyeDropper' in window)) {
    console.warn('EyeDropper API is not supported in this browser');
    return;
  }

  try {
    const eyeDropper = new (window.EyeDropper as unknown as {
      new(): EyeDropper;
    });
    const result = await eyeDropper.open();
    onColorChange(result.sRGBHex);
  } catch (e) {
    // User canceled the eye dropper
    console.log('EyeDropper cancelled', e);
  }
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  // Handle Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('keydown', handleEsc);
      // Cleanup
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [showPicker]); // Only re-run when showPicker changes

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex lg:flex-col gap-2">
        {/* Current Color Swatch */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ring-2 ring-white"
                style={{ backgroundColor: selectedColor }}
                onClick={() => setShowPicker(!showPicker)}
                title="Open color picker"
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Open color picker</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <button
          className="w-8 h-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ring-2 ring-white"
          style={{ backgroundColor: selectedColor }}
          onClick={() => setShowPicker(!showPicker)}
          title="Open color picker"
        /> */}
        
        {/* Eyedropper Button */}
        {'EyeDropper' in window && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => activateEyeDropper(onColorChange)}
                  title="Pick color from screen (I)"
                >
                  <Pipette className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Pick color from screen (I)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
        )}
      </div>

      {/* Color Picker Popover */}
      {showPicker && (
        <>
          <div 
            className="fixed inset-0" 
            onClick={() => setShowPicker(false)} 
          />
          <div className={`
            absolute z-50
            lg:-left-[216px] 
            bottom-12 left-0
            w-[216px]
          `}>
            <div className="relative bg-white/95 w-full max-w-md p-2 rounded-lg shadow-lg backdrop-blur-sm">
              <HexColorPicker 
                color={selectedColor}
                onChange={onColorChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
} 