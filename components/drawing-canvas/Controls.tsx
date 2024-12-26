'use client';

import { Slider } from "@/components/ui/slider";

interface ControlsProps {
  pressureMultiplier: number;
  onPressureMultiplierChange: (value: number) => void;
}

export function Controls({ pressureMultiplier, onPressureMultiplierChange }: ControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-4 z-10 p-4 bg-white/80 backdrop-blur rounded-lg shadow-sm w-64">
      <div className="space-y-2">
        <div className="text-sm">Line Thickness: {pressureMultiplier}</div>
        <Slider 
          value={[pressureMultiplier]}
          onValueChange={([value]) => onPressureMultiplierChange(value)}
          max={50}
          step={1}
        />
      </div>
    </div>
  );
} 