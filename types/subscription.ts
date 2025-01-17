export type SubscriptionTier = 'free' | 'pro';

export interface ExportOptions {
  pixelRatio: number;
  addWatermark: boolean;
  maxDimension?: number;
}

export const TIER_FEATURES: Record<SubscriptionTier, ExportOptions> = {
  free: {
    pixelRatio: 2,
    addWatermark: true,
    maxDimension: 2048,
  },
  pro: {
    pixelRatio: 10,
    addWatermark: false,
    maxDimension: undefined,
  }
}; 