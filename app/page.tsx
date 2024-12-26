"use client";

import { DrawingCanvas } from "@/components/drawing-canvas/DrawingCanvas";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen lg:p-4 py-12 bg-gray-100">
      <h1 className="text-2xl mb-4 text-left w-full max-w-[800px] mx-auto px-4">Draw for fun</h1>
      <DrawingCanvas />
    </div>
  );
}
