export interface VestDimensions {
  totalHeight: number;
  bottomWidth: number;
  bustWidth: number;
  armholeHeight: number;
  bodyHeight: number;
  hemHeight: number;
  shoulderWidth: number;
  neckWidth: number;
  placketWidth: number;
}

export interface Gauge {
  stitchesPer10cm: number;
  rowsPer10cm: number;
}

export const DEFAULT_DIMENSIONS: VestDimensions = {
  totalHeight: 64,
  bottomWidth: 52,
  bustWidth: 58,
  armholeHeight: 25,
  bodyHeight: 33,
  hemHeight: 6,
  shoulderWidth: 14,
  neckWidth: 18,
  placketWidth: 2,
};

export const DEFAULT_GAUGE: Gauge = {
  stitchesPer10cm: 23,
  rowsPer10cm: 30,
};
