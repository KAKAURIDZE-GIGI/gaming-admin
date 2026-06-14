import { useEffect, useRef, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "@/shared/lib/routes";
import { formatSigned } from "@/shared/lib/format";
import { BetSelector } from "@/shared/components/BetSelector";
import {
  PillToggleGroup,
  ToggleButton,
} from "@/shared/components/PillToggleGroup";
import { pillToggleButtonSx } from "@/shared/components/pillToggleStyles";
import { PageSection } from "@/shared/components/PageLayout";
import { QueryState } from "@/shared/components/QueryState";
import { useAuth } from "@/features/auth";
import { useSlot } from "../hooks";
import { playApi, type SlotResult } from "../api";
import { SlotReels } from "./SlotReels";
import { LINE_OPTIONS, SLOT_SYMBOLS, emojiFor, winningCells } from "./slotSymbols";

export default function SlotPlay() {
  const { id = "" } = useParams();
  const { data: slot, isLoading, isError, error } = useSlot(id);
  const { user, setBalance } = useAuth();
  const queryClient = useQueryClient();

  const [bet, setBet] = useState<number | null>(null);
  const [lines, setLines] = useState<number>(1);
  const [spinning, setSpinning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [spinId, setSpinId] = useState(0);
  const [finalGrid, setFinalGrid] = useState<string[][] | null>(null);
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<SlotResult | null>(null);
  const pending = useRef<SlotResult | null>(null);

  useEffect(() => {
    return () => {
      const res = pending.current;
      if (res) setBalance(res.balance);
    };
  }, [setBalance]);

  const effectiveBet = bet ?? slot?.betSizes[0] ?? null;
  const stake = (effectiveBet ?? 0) * lines;

  const handleSpin = async () => {
    if (!slot || effectiveBet == null || spinning || busy) return;
    if ((user?.balance ?? 0) < stake) {
      toast.error("Not enough coins for this stake");
      return;
    }
    setBusy(true);
    setResult(null);
    setCells(new Set());
    try {
      const res = await playApi.slot(slot.id, effectiveBet, lines);
      pending.current = res;
      setFinalGrid(res.grid);
      setCells(winningCells(res.winningLines));
      setSpinning(true);
      setSpinId((n) => n + 1);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Spin failed");
      setBusy(false);
    }
  };

  const handleSettled = () => {
    setSpinning(false);
    setBusy(false);
    const res = pending.current;
    if (!res) return;
    setResult(res);
    setBalance(res.balance);
    pending.current = null;
    queryClient.invalidateQueries({ queryKey: ["history"] });
    if (res.payout > 0) toast.success(`You won ${res.payout} coins!`);
    else toast("No win this time");
  };

  return (
    <Box>
      <Button
        component={RouterLink}
        to={ROUTES.SLOTS}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        All slots
      </Button>
      <QueryState isLoading={isLoading} isError={isError} error={error} />
      {slot && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <PageSection sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                {slot.name}
              </Typography>
              <SlotReels
                finalGrid={finalGrid}
                spinId={spinId}
                spinning={spinning}
                winningCells={cells}
                onSettled={handleSettled}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleSpin}
                disabled={spinning || busy || effectiveBet == null}
                sx={{ mt: 3, minWidth: 200, fontSize: 18 }}
              >
                {spinning ? "Spinning…" : `SPIN · ${stake}`}
              </Button>
              {result && (
                <Alert
                  severity={result.amountWon > 0 ? "success" : "info"}
                  sx={{ mt: 2, justifyContent: "center" }}
                >
                  {result.winningLines.length
                    ? `${result.winningLines.length} line(s) hit · `
                    : "No win · "}
                  {formatSigned(result.amountWon)} coins
                </Alert>
              )}
            </PageSection>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <PageSection>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, lineHeight: 1.6, wordBreak: "break-word" }}
              >
                {slot.description}
              </Typography>

              <Stack spacing={3}>
                <BetSelector
                  betSizes={slot.betSizes}
                  value={effectiveBet}
                  onChange={setBet}
                  disabled={spinning || busy}
                  label="Bet per line"
                />

                <Stack spacing={1} sx={{ width: "100%" }}>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.6 }}
                  >
                    Lines to play
                  </Typography>
                  <PillToggleGroup
                    exclusive
                    value={lines}
                    onChange={(_, v) => v != null && setLines(v)}
                    disabled={spinning || busy}
                  >
                    {LINE_OPTIONS.map((n) => (
                      <ToggleButton
                        key={n}
                        value={n}
                        sx={(theme) => ({ ...pillToggleButtonSx(theme), px: 3 })}
                      >
                        {n} line{n > 1 ? "s" : ""}
                      </ToggleButton>
                    ))}
                  </PillToggleGroup>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Total stake</Typography>
                  <Typography sx={{ fontWeight: 800 }}>{stake} coins</Typography>
                </Stack>

                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ display: "block", lineHeight: 1.6 }}
                  >
                    Paytable (× bet, per line)
                  </Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    {Object.entries(SLOT_SYMBOLS)
                      .sort((a, b) => a[1].multiplier - b[1].multiplier)
                      .map(([key, s]) => (
                        <Stack key={key} direction="row" justifyContent="space-between">
                          <Typography>
                            {emojiFor(key)} {emojiFor(key)} {emojiFor(key)}
                          </Typography>
                          <Typography color="text.secondary">×{s.multiplier}</Typography>
                        </Stack>
                      ))}
                  </Stack>
                </Box>
              </Stack>
            </PageSection>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
