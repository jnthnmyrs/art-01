import type { StageRef, ShowToast } from './types';
import { track } from "@vercel/analytics";
import { TIER_FEATURES } from "@/types/subscription";

export const handleExportPNG = (stageRef: StageRef, showToast: ShowToast) => {
  const stage = stageRef.current;
  if (!stage) {
    console.error("No stage ref found");
    return;
  }

  const { pixelRatio, addWatermark } = TIER_FEATURES.free;

  stage.toDataURL({
    pixelRatio,
    callback: (dataUrl) => {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        if (!tempCtx) return;

        tempCanvas.width = stage.width() * pixelRatio;
        tempCanvas.height = stage.height() * pixelRatio;

        // Draw white background
        tempCtx.fillStyle = "white";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the stage image
        tempCtx.drawImage(img, 0, 0);

        if (addWatermark) {
          const watermark = new Image();
          watermark.onload = () => {
            const padding = 20 * pixelRatio;
            const x = (tempCanvas.width - watermark.width) / 2;
            const y = tempCanvas.height - watermark.height - padding;
            tempCtx.drawImage(watermark, x, y);
            downloadImage(tempCanvas.toDataURL());
          };
          watermark.src = "/watermark-drawwwtime.png";
        } else {
          downloadImage(tempCanvas.toDataURL());
        }
      };
      img.src = dataUrl;
    },
  });

  track("Downloaded PNG drawing");
  showToast({
    title: "PNG saved! 🎨",
    description: "Your masterpiece has been downloaded to your computer.",
    duration: 3000,
  });
};

const downloadImage = (dataUrl: string) => {
  const link = document.createElement("a");
  const date = new Date().toISOString().split("T")[0];
  const random = Math.random().toString(36).substring(2, 8);
  link.download = `drawwwtime-${date}-${random}.png`;
  link.href = dataUrl;
  link.click();
}; 