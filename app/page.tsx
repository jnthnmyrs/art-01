"use client";

import dynamic from 'next/dynamic';

const DrawingCanvas = dynamic(
  () => import('@/components/drawing-canvas/DrawingCanvas').then((mod) => mod.DrawingCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen lg:p-4 py-12 bg-gray-100">

      <DrawingCanvas />
    </div>
  );
}
