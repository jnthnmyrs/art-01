"use client";

import dynamic from "next/dynamic";
// import { VectorCanvas } from "@/components/vector-canvas/VectorCanvas";

const DrawingCanvas = dynamic(
  () =>
    import("@/components/drawing-canvas/DrawingCanvas").then(
      (mod) => mod.DrawingCanvas
    ),
  { ssr: false }
);

export default function Draw() {
  return (
    <>
    <div className="flex flex-col max-h-screen max-w-screen-2xl mx-auto items-center mt-4 lg:mt-0 justify-center m-0 lg:p-4 py-0 bg-gray-100 h-screen">
      <DrawingCanvas /> 
      {/* <VectorCanvas /> */}
    </div>
  </>
  )
}
