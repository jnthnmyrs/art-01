"use client";

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

import { useMemo } from "react";
import { Footer } from "./Footer";
import { Info } from "lucide-react";

export function AboutDialog() {
  // Detect OS
  const isMac = useMemo(() => {
    if (typeof window === "undefined") return false; // SSR check
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }, []);

  const shortcuts = useMemo(
    () => ({
      brush: "B",
      eyedropper: isMac ? "Ctrl+C or I" : "I",
      eraser: "E",
      brushSize: "[ ] or A S",
      undo: isMac ? "⌘ + Z" : "Ctrl + Z",
      redo: isMac ? "⌘ + Shift + Z" : "Ctrl + Shift + Z",
      save: isMac ? "⌘ + Shift + S" : "Ctrl + Shift + S",
    }),
    [isMac]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className=" h-8 w-8 ">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-left">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src="/info-mark.png"
              alt="Drawww Time Info"
              width={32}
              height={32}
            />
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
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {shortcuts.brush}
                  </kbd>{" "}
                  - Brush
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {shortcuts.eyedropper}
                  </kbd>{" "}
                  - Eyedropper
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {shortcuts.brushSize}
                  </kbd>{" "}
                  - Adjust brush size
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {shortcuts.eraser}
                  </kbd>{" "}
                  - Eraser
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {isMac ? "⌘" : "Ctrl"}
                  </kbd>{" "}
                  +<kbd className="px-1 rounded bg-gray-100">Z</kbd> - Undo
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {isMac ? "⌘" : "Ctrl"}
                  </kbd>{" "}
                  +<kbd className="px-1 rounded bg-gray-100">Shift</kbd> +
                  <kbd className="px-1 rounded bg-gray-100">Z</kbd> - Redo
                </li>
                <li>
                  <kbd className="px-1 rounded bg-gray-100">
                    {isMac ? "⌘" : "Ctrl"}
                  </kbd>{" "}
                  +<kbd className="px-1 rounded bg-gray-100">Shift</kbd> +
                  <kbd className="px-1 rounded bg-gray-100">S</kbd> - Save
                  Drawing
                </li>
              </ul>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col  justify-center mt-4">
          <p className="text-sm text-gray-500">
            {`I made Drawww Time just for fun. It brings a small piece of Flash back to the web. Explore all the wonders of vector drawing and share it with you very best friends.`}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {`Colorfully,`}
          </p>
          <p className="text-sm text-gray-500 ">
            {`Jonathan Bezier`}
          </p>
        </div>
        <Footer />
      </DialogContent>
    </Dialog>
  );
}
