'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  // DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { track } from "@vercel/analytics"
import { useMemo } from "react";

export function AboutDialog() {
  // Detect OS
  const isMac = useMemo(() => {
    if (typeof window === 'undefined') return false; // SSR check
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  }, []);

  const shortcuts = useMemo(() => ({
    brush: 'B',
    eyedropper: isMac ? 'Ctrl+C or I' : 'I',
    eraser: 'E',
    brushSize: '[ ] or A S',
    undo: isMac ? '⌘ + Z' : 'Ctrl + Z',
    redo: isMac ? '⌘ + Shift + Z' : 'Ctrl + Shift + Z',
    save: isMac ? '⌘ + Shift + S' : 'Ctrl + Shift + S',
  }), [isMac]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white/90 drop-shadow-md hover:drop-shadow-lg transition-all duration-200"
        >
         <Image src="/info-mark.png" alt="Drawww Time Info" width={32} height={32} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-left">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image src="/info-mark.png" alt="Drawww Time Info" width={32} height={32} />
            Drawww Time
          </DialogTitle>
          <div className="space-y-4">
            <div className="space-y-2 text-gray-500 text-left">
              {`A simple drawing app for the web.`}
              <br />
              <span className="text-xs mt-2">
                {`(Best experienced on desktop)`}
              </span>
            </div>
            <div className="space-y-2 text-left text-gray-500 text-sm">
              <div className="font-medium">Keyboard Shortcuts:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li><kbd className="px-1 rounded bg-gray-100">{shortcuts.brush}</kbd> - Brush</li>
                <li><kbd className="px-1 rounded bg-gray-100">{shortcuts.eyedropper}</kbd> - Eyedropper</li>
                <li><kbd className="px-1 rounded bg-gray-100">{shortcuts.brushSize}</kbd> - Adjust brush size</li>
                <li><kbd className="px-1 rounded bg-gray-100">{shortcuts.eraser}</kbd> - Eraser</li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">{isMac ? '⌘' : 'Ctrl'}</kbd> + 
                  <kbd className="px-1 rounded bg-gray-100">Z</kbd> - Undo
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">{isMac ? '⌘' : 'Ctrl'}</kbd> + 
                  <kbd className="px-1 rounded bg-gray-100">Shift</kbd> + 
                  <kbd className="px-1 rounded bg-gray-100">Z</kbd> - Redo
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">{isMac ? '⌘' : 'Ctrl'}</kbd> + 
                  <kbd className="px-1 rounded bg-gray-100">Shift</kbd> + 
                  <kbd className="px-1 rounded bg-gray-100">S</kbd> - Save Drawing
                </li>
              </ul>
            </div>
          </div>
        </DialogHeader>
        <a
          href="https://jonathan.now"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 p-2 px-4 mt-4 hover:bg-gray-100 rounded-full w-fit mx-auto"
          onClick={() => track("jonathan.now click")}
        >
          <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200">Made by</span>
          <Image src="/sig.png" alt="Jonathan" width={100} height={100} className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="sr-only">made by Jonathan Myers | Product Designer</span>
        </a>
      </DialogContent>
    </Dialog>
  );
} 