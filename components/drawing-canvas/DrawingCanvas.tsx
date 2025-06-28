"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { ToolBar } from "./ToolBar";
import { useDrawingState } from "./useDrawingState";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { Skeleton } from "@/components/ui/skeleton";
import type Konva from "konva";
import StrokeLayer from "./StrokeLayer";
import { Stage, Layer } from "react-konva";


import { useToast } from "@/hooks/use-toast";
import { handleExportPNG, handleExportSVG } from './exportHandlers';

const MAX_CANVAS_SIZE = 3000;
const DEFAULT_TRANSPARENT_BACKGROUND = false;


export function DrawingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const [transparentBackground, setTransparentBackground] = useState(
    DEFAULT_TRANSPARENT_BACKGROUND
  );
  const [exportFormat, setExportFormat] = useState<'png' | 'svg'>('png');

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
    brushStyle,
    setBrushStyle,
  } = useDrawingState();

  const { toast } = useToast();

  const handleFormatExport = useCallback(() => {
    if (exportFormat === 'png') {
      handleExportPNG(stageRef, toast); 
    } else {
      handleExportSVG(stageRef, toast);
    }
  }, [exportFormat, stageRef, toast]);

  // Use the format-aware handler in keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    setTool: setTool,
    setPressureMultiplier: setPressureMultiplier,
    pressureMultiplier: pressureMultiplier,
    onColorChange: setColor,
    onExport: handleFormatExport, // Use the new handler here
    exportFormat,
    onExportFormatChange: setExportFormat,
  });

  // Track the current pressure-adjusted size
  const [currentSize, setCurrentSize] = useState(pressureMultiplier);

  // Wrap the existing handleMouseMove to add pressure tracking
  const handleMouseMoveWithPressure = (
    e: Konva.KonvaEventObject<PointerEvent>
  ) => {
    const pressure = e.evt.pressure || 0.5; // Default to 0.5 if pressure not supported
    setCurrentSize(pressureMultiplier * pressure);
    handleMouseMove(e); // Call the original handleMouseMove
  };

  // Helper function to get cursor style
  const getCursorStyle = () => {
    if (tool === "eraser") {
      const eraserSize = Math.min(currentSize / 2, 20); // Match brush scaling
      return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="${eraserSize}" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="${eraserSize}" stroke="black" stroke-width="1" stroke-dasharray="3 3"/></svg>') 24 24, auto`;
    }
    // Scale cursor size with current pressure-adjusted size
    const cursorSize = Math.min(currentSize / 2, 20);
    // Create SVG with both white outline and color stroke
    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="${cursorSize}" stroke="black" stroke-width="4"/><circle cx="24" cy="24" r="${cursorSize}" stroke="white" stroke-width="3"/><circle cx="24" cy="24" r="${cursorSize}" stroke="${encodeURIComponent(
      color
    )}" stroke-width="2"/></svg>') 24 24, auto`;
  };

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
      [stageElement, containerElement].forEach((element) => {
        element.addEventListener("touchstart", preventScroll, {
          passive: false,
        });
        element.addEventListener("touchmove", preventScroll, {
          passive: false,
        });
        element.addEventListener("touchend", preventScroll, { passive: false });
        // Also prevent default on touchcancel
        element.addEventListener("touchcancel", preventScroll, {
          passive: false,
        });
      });
    }

    return () => {
      if (stageElement && containerElement) {
        [stageElement, containerElement].forEach((element) => {
          element.removeEventListener("touchstart", preventScroll);
          element.removeEventListener("touchmove", preventScroll);
          element.removeEventListener("touchend", preventScroll);
          element.removeEventListener("touchcancel", preventScroll);
        });
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col  justify-center lg:flex-row   max-w-full w-full  items-center mx-auto px-4 py-0 m-0  ">
      <div className=" md:bottom-0 md:left-0 lg:top-0 lg:left-0 ">
        <ToolBar
          tool={tool}
          color={color}
          pressureMultiplier={pressureMultiplier}
          transparentBackground={transparentBackground}
          onToolChange={setTool}
          onColorChange={setColor}
          onPressureMultiplierChange={setPressureMultiplier}
          onTransparentBackgroundChange={setTransparentBackground}
          onClear={handleClear}
          onExport={handleFormatExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          brushStyle={brushStyle}
          onBrushStyleChange={setBrushStyle}
          isMain={true}
          exportFormat={exportFormat}
          onExportFormatChange={setExportFormat}
        />
      </div>

      <div
        ref={containerRef}
        className="relative border aspect-square max-w-[750px] max-h-[750px] mx-auto border-gray-200 rounded-lg bg-white touch-none"
        style={{
          width: "100%",
          aspectRatio: "1/1",
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
            onPointerMove={handleMouseMoveWithPressure}
            onPointerUp={handleMouseUp}
            style={{
              touchAction: "none",
              cursor: getCursorStyle(),
            }}
          >
            <Layer>
              <StrokeLayer
                lines={lines}
                // brushStyle={brushStyle}
              />
            </Layer>
          </Stage>
        )}
      </div>

      <div className=" md:bottom-0 md:left-0 lg:top-0 lg:left-0 ">
        <ToolBar
          tool={tool}
          color={color}
          pressureMultiplier={pressureMultiplier}
          transparentBackground={transparentBackground}
          onToolChange={setTool}
          onColorChange={setColor}
          onPressureMultiplierChange={setPressureMultiplier}
          onTransparentBackgroundChange={setTransparentBackground}
          onClear={handleClear}
          onExport={handleFormatExport}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          brushStyle={brushStyle}
          onBrushStyleChange={setBrushStyle}
          isMain={false}
          exportFormat={exportFormat}
          onExportFormatChange={setExportFormat}
        />
      </div>


    </div>
  );
}
