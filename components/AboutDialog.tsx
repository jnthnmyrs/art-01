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


export function AboutDialog() {
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
          <DialogTitle>Drawww Time</DialogTitle>
          <div className="space-y-4">
            <div className="space-y-2 text-gray-500">
              {`A simple drawing app for the web.`}
              <br />
              <span className="text-xs mt-2">
                {`(Best experienced on desktop)`}
              </span>
            </div>
            <div className="space-y-2 text-left text-gray-500">
              <div className="font-medium">Keyboard Shortcuts:</div>
              <ul className="list-disc pl-4 space-y-1">
                <li><kbd className="px-1 rounded bg-gray-100">B</kbd> - Brush tool</li>
                <li><kbd className="px-1 rounded bg-gray-100">E</kbd> - Eraser tool</li>
                <li><kbd className="px-1 rounded bg-gray-100">1</kbd> <kbd className="px-1 rounded bg-gray-100">2</kbd> <kbd className="px-1 rounded bg-gray-100">3</kbd> - Brush sizes</li>
                <li><kbd className="px-1 rounded bg-gray-100">Ctrl/⌘</kbd> + <kbd className="px-1 rounded bg-gray-100">Z</kbd> - Undo</li>
                <li><kbd className="px-1 rounded bg-gray-100">Ctrl/⌘</kbd> + <kbd className="px-1 rounded bg-gray-100">Shift</kbd> + <kbd className="px-1 rounded bg-gray-100">Z</kbd> - Redo</li>
              </ul>
            </div>
          </div>
        </DialogHeader>
        <a
        href="https://jonathan.now"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex  items-center justify-center gap-2 p-2 px-4 mt-4 hover:bg-gray-100 rounded-full w-fit mx-auto"
      >
        <span className="text-sm opacity-50 group-hover:opacity-100 transition-opacity duration-200">Made by</span><Image src="/sig.png" alt="Jonathan" width={100} height={100} className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
        <span className="sr-only">made by Jonathan Myers | Product Designer</span>
      </a>
      </DialogContent>
    </Dialog>
  );
} 