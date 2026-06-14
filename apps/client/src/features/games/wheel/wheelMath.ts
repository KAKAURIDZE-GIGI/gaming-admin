import type { WheelSegment } from "@/shared/types";

export const SPIN_DURATION_MS = 4500;

/**
 * Absolute rotation (deg) that lands the top pointer on the middle of
 * `winnerIndex`, always spinning forward from `current`.
 */
export function rotationForIndex(
  segments: WheelSegment[],
  winnerIndex: number,
  current: number,
  fullSpins = 5,
): number {
  const total = segments.reduce((s, x) => s + x.weight, 0);
  let segStart = 0;
  for (let i = 0; i < winnerIndex; i++) {
    segStart += (segments[i].weight / total) * 360;
  }
  const segMid = segStart + ((segments[winnerIndex].weight / total) * 360) / 2;
  const desiredMod = (((360 - segMid) % 360) + 360) % 360;
  const delta = ((desiredMod - (current % 360)) + 360) % 360;
  return current + fullSpins * 360 + delta;
}
