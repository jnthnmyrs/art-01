import type { Stage } from 'konva/lib/Stage';
import type { RefObject } from 'react';

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export type ShowToast = (props: ToastProps) => void;
export type StageRef = RefObject<Stage | null>; 