declare module 'react-konva-to-svg' {
  import { Stage } from 'konva/lib/Stage';

  interface ExportOptions {
    onBefore?: (nodes: [Stage, any]) => void;
    onAfter?: (nodes: [Stage, any]) => void;
  }

  export function exportStageSVG(
    stage: Stage,
    download?: boolean,
    options?: ExportOptions
  ): Promise<string>;
} 