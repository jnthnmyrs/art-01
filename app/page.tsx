"use client";

import dynamic from 'next/dynamic';

const DrawingCanvas = dynamic(
  () => import('@/components/drawing-canvas/DrawingCanvas').then((mod) => mod.DrawingCanvas),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex flex-col max-h-screen max-w-screen-2xl mx-auto items-start mt-4 lg:mt-0 justify-start m-0 lg:p-4 py-0 bg-gray-100 h-fit">

      <DrawingCanvas />
    </div>
  );
}
