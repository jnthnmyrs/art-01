declare module 'clipper-lib' {
  export enum ClipType {
    ctIntersection = 0,
    ctUnion = 1,
    ctDifference = 2,
    ctXor = 3
  }

  export enum PolyType {
    ptSubject = 0,
    ptClip = 1
  }

  export enum PolyFillType {
    pftEvenOdd = 0,
    pftNonZero = 1,
    pftPositive = 2,
    pftNegative = 3
  }

  export interface IntPoint {
    X: number;
    Y: number;
  }

  export type Path = IntPoint[];
  export type Paths = Path[];

  export class Clipper {
    constructor();
    AddPath(path: Path, polyType: PolyType, closed: boolean): boolean;
    AddPaths(paths: Paths, polyType: PolyType, closed: boolean): boolean;
    Execute(
      clipType: ClipType,
      solution: Paths,
      subjFillType?: PolyFillType,
      clipFillType?: PolyFillType
    ): boolean;
    Clear(): void;
  }
} 