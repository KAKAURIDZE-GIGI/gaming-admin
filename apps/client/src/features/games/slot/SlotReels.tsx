import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { emojiFor, SYMBOL_KEYS } from "./slotSymbols";

// Staggered stop times per reel (left → right) and the spin tick rate.
const REEL_STOPS = [800, 1200, 1600];
const TICK = 70;

function rand() {
  return SYMBOL_KEYS[Math.floor(Math.random() * SYMBOL_KEYS.length)];
}
function randomReel() {
  return [rand(), rand(), rand()];
}

export function SlotReels({
  finalGrid,
  spinId,
  spinning,
  winningCells,
  onSettled,
}: {
  finalGrid: string[][] | null;
  spinId: number;
  spinning: boolean;
  winningCells: Set<string>;
  onSettled: () => void;
}) {
  const [grid, setGrid] = useState<string[][]>(() => [
    randomReel(),
    randomReel(),
    randomReel(),
  ]);
  const intervals = useRef<number[]>([]);
  const timeouts = useRef<number[]>([]);
  const onSettledRef = useRef(onSettled);
  const finalGridRef = useRef(finalGrid);
  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);
  useEffect(() => {
    finalGridRef.current = finalGrid;
  }, [finalGrid]);

  useEffect(() => {
    const settledGrid = finalGridRef.current;
    if (spinId === 0 || !settledGrid) return; // nothing spun yet

    const clearAll = () => {
      intervals.current.forEach(clearInterval);
      timeouts.current.forEach(clearTimeout);
      intervals.current = [];
      timeouts.current = [];
    };
    clearAll();

    for (let reel = 0; reel < 3; reel++) {
      intervals.current[reel] = window.setInterval(() => {
        setGrid((prev) => {
          const next = prev.map((r) => [...r]);
          next[reel] = randomReel();
          return next;
        });
      }, TICK);

      timeouts.current[reel] = window.setTimeout(() => {
        clearInterval(intervals.current[reel]);
        setGrid((prev) => {
          const next = prev.map((r) => [...r]);
          next[reel] = [...settledGrid[reel]];
          return next;
        });
        if (reel === 2) onSettledRef.current();
      }, REEL_STOPS[reel]);
    }

    return clearAll;
  }, [spinId]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        justifyContent: "center",
        p: 2,
        borderRadius: 4,
        background: "linear-gradient(160deg,#1b1430,#0d0820)",
        border: "3px solid",
        borderColor: "secondary.main",
        boxShadow: "inset 0 0 30px rgba(0,0,0,.6)",
      }}
    >
      {grid.map((reel, ri) => (
        <Box key={ri} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {reel.map((sym, row) => {
            const win = !spinning && winningCells.has(`${ri}-${row}`);
            return (
              <Box
                key={row}
                sx={{
                  width: { xs: 60, sm: 76 },
                  height: { xs: 60, sm: 76 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: { xs: 34, sm: 44 },
                  borderRadius: 2,
                  bgcolor: win ? "secondary.main" : "rgba(255,255,255,0.06)",
                  boxShadow: win
                    ? "0 0 18px 4px rgba(245,158,11,.8)"
                    : "inset 0 0 8px rgba(0,0,0,.5)",
                  transform: spinning ? "scale(0.94)" : win ? "scale(1.06)" : "none",
                  transition: "transform .15s, box-shadow .2s, background-color .2s",
                  filter: spinning ? "blur(0.6px)" : "none",
                }}
              >
                {emojiFor(sym)}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
