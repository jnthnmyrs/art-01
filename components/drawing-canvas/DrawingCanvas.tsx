"use client";


import { useRef, useEffect, useState } from "react";
import { ToolBar } from "./ToolBar";
import { useDrawingState } from "./useDrawingState";
import { useKeyboardShortcuts } from "./useKeyboardShortcuts";
import { Skeleton } from "@/components/ui/skeleton";
import type Konva from "konva";
import StrokeLayer from "./StrokeLayer";
import { Stage, Layer } from 'react-konva';


const MAX_CANVAS_SIZE = 1000;

export function DrawingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const [transparentBackground, setTransparentBackground] = useState(false);

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

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    setTool,
    setPressureMultiplier,
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
      ...(transparentBackground ? {} : { 
        callback: ((dataUrl: string) => {
          // Create a temporary canvas to modify the image
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            if (tempCtx) {
              tempCanvas.width = img.width;
              tempCanvas.height = img.height;
              tempCtx.drawImage(img, 0, 0);
              tempCtx.globalCompositeOperation = 'destination-over';
              tempCtx.fillStyle = 'white';
              tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
              
              // Create download link
              const link = document.createElement("a");
              link.download = `drawing-${new Date().toISOString()}.png`;
              link.href = tempCanvas.toDataURL('image/png');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          };
          
          img.src = dataUrl;
        })
      })
    });

    if (transparentBackground) {
      // If transparent, download directly
      const link = document.createElement("a");
      link.download = `drawing-${new Date().toISOString()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Track the current pressure-adjusted size
  const [currentSize, setCurrentSize] = useState(pressureMultiplier);

  // Wrap the existing handleMouseMove to add pressure tracking
  const handleMouseMoveWithPressure = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const pressure = e.evt.pressure || 0.5; // Default to 0.5 if pressure not supported
    setCurrentSize(pressureMultiplier * pressure);
    handleMouseMove(e); // Call the original handleMouseMove
  };

  // Helper function to get cursor style
  const getCursorStyle = () => {
    if (tool === 'eraser') {
      const eraserSize = Math.min(currentSize/2, 20);  // Match brush scaling
      return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="${eraserSize}" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="${eraserSize}" stroke="black" stroke-width="1" stroke-dasharray="3 3"/></svg>') 24 24, auto`;
    }
    // Scale cursor size with current pressure-adjusted size
    const cursorSize = Math.min(currentSize/2, 20);
    // Create SVG with both white outline and color stroke
    return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="${cursorSize}" stroke="white" stroke-width="2"/><circle cx="24" cy="24" r="${cursorSize}" stroke="${encodeURIComponent(color)}" stroke-width="1"/></svg>') 24 24, auto`;
  };

  return (
    <div className="w-full max-w-[790px] mx-auto px-4 py-0 m-0  flex flex-col ">
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
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        brushStyle={brushStyle}
        onBrushStyleChange={setBrushStyle}
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
            onPointerMove={handleMouseMoveWithPressure}
            onPointerUp={handleMouseUp}
            style={{ 
              touchAction: 'none',
              cursor: getCursorStyle()
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
    </div>
  );
}
