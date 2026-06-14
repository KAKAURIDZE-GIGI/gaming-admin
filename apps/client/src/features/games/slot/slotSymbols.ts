// Fruit symbols — keep in sync with server lib/slotEngine.js.
export const SLOT_SYMBOLS: Record<string, { emoji: string; multiplier: number }> = {
  cherry: { emoji: "🍒", multiplier: 2 },
  lemon: { emoji: "🍋", multiplier: 3 },
  orange: { emoji: "🍊", multiplier: 4 },
  strawberry: { emoji: "🍓", multiplier: 5 },
  grape: { emoji: "🍇", multiplier: 8 },
  watermelon: { emoji: "🍉", multiplier: 12 },
};

export const SYMBOL_KEYS = Object.keys(SLOT_SYMBOLS);

export function emojiFor(key: string): string {
  return SLOT_SYMBOLS[key]?.emoji ?? "❓";
}

// row index per reel (0=top,1=mid,2=bottom) — mirrors server PAYLINES order.
export const PAYLINES: number[][] = [
  [1, 1, 1], // 0 center row
  [0, 0, 0], // 1 top row
  [2, 2, 2], // 2 bottom row
  [0, 1, 2], // 3 diagonal ↘
  [2, 1, 0], // 4 diagonal ↗
  [0, 2, 0], // 5 V
  [2, 0, 2], // 6 ^
  [1, 0, 1], // 7 zigzag
  [1, 2, 1], // 8 zagzig
];

export const LINE_OPTIONS = [1, 3, 9] as const;

/** Cells (reel,row) that belong to the given winning line indices. */
export function winningCells(lineIndices: number[]): Set<string> {
  const cells = new Set<string>();
  for (const li of lineIndices) {
    const line = PAYLINES[li];
    for (let reel = 0; reel < 3; reel++) cells.add(`${reel}-${line[reel]}`);
  }
  return cells;
}
