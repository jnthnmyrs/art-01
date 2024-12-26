"use client";


import { useRef, useEffect, useState } from "react";
import { ToolBar } from "./ToolBar";
import { useDrawingState } from "./useDrawingState";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { Skeleton } from "@/components/ui/skeleton";
import type Konva from "konva";
import StrokeLayer from "./StrokeLayer";
import { Layer, Stage } from 'react-konva';


const MAX_CANVAS_SIZE = 750;

export function DrawingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);

  const {
    lines,
    tool,
    color,
    pressureMultiplier,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    setTool,
    setColor,
    setPressureMultiplier,
    handleClear,
    handleUndo,
    handleRedo,
    canUndo,
    canRedo,
  } = useDrawingState();

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    setTool,
  });

  // Single effect for initialization and resize
  useEffect(() => {
    if (!containerRef.current) return;

    // Set initial size immediately
    const width = Math.min(containerRef.current.offsetWidth, MAX_CANVAS_SIZE);
    setDimensions({ width, height: width });
    setIsReady(true);

    // Handle subsequent resizes
    const resizeObserver = new ResizeObserver((entries) => {
      const width = Math.min(entries[0].contentRect.width, MAX_CANVAS_SIZE);
      setDimensions({ width, height: width });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Prevent touch scrolling when interacting with canvas
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Get both the stage container and the outer container
    const stageElement = stageRef.current?.container();
    const containerElement = containerRef.current;

    if (stageElement && containerElement) {
      // Add listeners to both elements
      [stageElement, containerElement].forEach(element => {
        element.addEventListener('touchstart', preventScroll, { passive: false });
        element.addEventListener('touchmove', preventScroll, { passive: false });
        element.addEventListener('touchend', preventScroll, { passive: false });
        // Also prevent default on touchcancel
        element.addEventListener('touchcancel', preventScroll, { passive: false });
      });
    }

    return () => {
      if (stageElement && containerElement) {
        [stageElement, containerElement].forEach(element => {
          element.removeEventListener('touchstart', preventScroll);
          element.removeEventListener('touchmove', preventScroll);
          element.removeEventListener('touchend', preventScroll);
          element.removeEventListener('touchcancel', preventScroll);
        });
      }
    };
  }, []);

  const handleExport = () => {
    if (!stageRef.current) return;

    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 2, // Export at 2x resolution
      mimeType: "image/png",
    });

    const link = document.createElement("a");
    link.download = `drawing-${new Date().toISOString()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 lg:flex-row flex flex-col">
      <ToolBar
        tool={tool}
        color={color}
        pressureMultiplier={pressureMultiplier}
        onToolChange={setTool}
        onColorChange={setColor}
        onPressureMultiplierChange={setPressureMultiplier}
        onClear={handleClear}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      
      <div 
        ref={containerRef} 
        className="relative border border-gray-200 rounded-lg bg-white touch-none"
        style={{ 
          width: '100%',
          aspectRatio: '1/1'
        }}
      >
        {!isReady ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <Stage
            ref={stageRef}
            width={dimensions.width}
            height={dimensions.height}
            onPointerDown={handleMouseDown}
            onPointerMove={handleMouseMove}
            onPointerUp={handleMouseUp}
            style={{ touchAction: 'none' }}
          >
            <Layer>
              <StrokeLayer lines={lines} />
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}
