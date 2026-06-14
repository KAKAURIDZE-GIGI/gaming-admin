// Server-authoritative slot logic. A spin is a 3x3 grid (3 reels of 3 rows).
// The admin-configured `winRate` is the probability a spin is a winning spin.
// Outcomes are decided here — the client only animates to this result.

// Fruit symbols. weight = how often it appears on a winning line (rarer = bigger
// multiplier). Keep in sync with the client's slotSymbols.ts.
const SYMBOLS = [
  { key: "cherry", weight: 30, multiplier: 2 },
  { key: "lemon", weight: 25, multiplier: 3 },
  { key: "orange", weight: 20, multiplier: 4 },
  { key: "strawberry", weight: 13, multiplier: 5 },
  { key: "grape", weight: 8, multiplier: 8 },
  { key: "watermelon", weight: 4, multiplier: 12 },
];
const SYMBOL_KEYS = SYMBOLS.map((s) => s.key);

// Each payline lists the row index (0=top,1=mid,2=bottom) for each of the 3 reels.
const PAYLINES = [
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

const ALLOWED_LINES = [1, 3, 9];

function playedLineIndices(lines) {
  if (lines === 1) return [0];
  if (lines === 3) return [0, 1, 2];
  return [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function randSymbol() {
  return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
}

function weightedSymbol() {
  const total = SYMBOLS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const s of SYMBOLS) {
    r -= s.weight;
    if (r < 0) return s;
  }
  return SYMBOLS[0];
}

function multiplierFor(key) {
  return SYMBOLS.find((s) => s.key === key)?.multiplier || 0;
}

// grid is reel-major: grid[reel][row]
function cellOnLine(grid, lineIdx, reel) {
  return grid[reel][PAYLINES[lineIdx][reel]];
}

function lineIsMatch(grid, lineIdx) {
  const a = cellOnLine(grid, lineIdx, 0);
  return a === cellOnLine(grid, lineIdx, 1) && a === cellOnLine(grid, lineIdx, 2);
}

function emptyGrid() {
  return [
    [randSymbol(), randSymbol(), randSymbol()],
    [randSymbol(), randSymbol(), randSymbol()],
    [randSymbol(), randSymbol(), randSymbol()],
  ];
}

/**
 * Run one spin.
 * @returns { grid, winningLines, payout } where payout is gross winnings (per
 *          matching line: symbol multiplier * bet). Net is computed by caller.
 */
function spin({ winRate = 30, bet, lines }) {
  const played = playedLineIndices(lines);
  const isWin = Math.random() * 100 < winRate;
  let grid = emptyGrid();

  if (isWin) {
    // Force one played line to be a win with a weighted-random fruit.
    const winLine = played[Math.floor(Math.random() * played.length)];
    const fruit = weightedSymbol();
    for (let reel = 0; reel < 3; reel++) {
      grid[reel][PAYLINES[winLine][reel]] = fruit.key;
    }
  } else {
    // Losing spin: regenerate until no played line happens to match.
    let attempts = 0;
    while (played.some((l) => lineIsMatch(grid, l)) && attempts < 50) {
      grid = emptyGrid();
      attempts++;
    }
    // Last resort: break any accidental match by nudging a cell.
    for (const l of played) {
      if (lineIsMatch(grid, l)) {
        const cur = cellOnLine(grid, l, 0);
        const other = SYMBOL_KEYS.find((k) => k !== cur) || cur;
        grid[0][PAYLINES[l][0]] = other;
      }
    }
  }

  // Tally all matching played lines (a forced win can light up extras too).
  const winningLines = [];
  let payout = 0;
  for (const l of played) {
    if (lineIsMatch(grid, l)) {
      winningLines.push(l);
      payout += multiplierFor(cellOnLine(grid, l, 0)) * bet;
    }
  }

  return { grid, winningLines, payout };
}

module.exports = { SYMBOLS, PAYLINES, ALLOWED_LINES, playedLineIndices, spin };
