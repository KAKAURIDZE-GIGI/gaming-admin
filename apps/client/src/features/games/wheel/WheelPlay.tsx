import { useState } from "react";
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
import { PageSection } from "@/shared/components/PageLayout";
import { QueryState } from "@/shared/components/QueryState";
import { useAuth } from "@/features/auth";
import { useWheel } from "../hooks";
import { playApi, type WheelResult } from "../api";
import { SpinWheel } from "./SpinWheel";
import { rotationForIndex, SPIN_DURATION_MS } from "./wheelMath";

export default function WheelPlay() {
  const { id = "" } = useParams();
  const { data: wheel, isLoading, isError, error } = useWheel(id);
  const { user, setBalance } = useAuth();
  const queryClient = useQueryClient();

  const [bet, setBet] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelResult | null>(null);

  const effectiveBet = bet ?? wheel?.betSizes[0] ?? null;

  const handleSpin = async () => {
    if (!wheel || effectiveBet == null || spinning) return;
    if ((user?.balance ?? 0) < effectiveBet) {
      toast.error("Not enough coins for this bet");
      return;
    }
    setResult(null);
    try {
      const res = await playApi.wheel(wheel.id, effectiveBet);
      setSpinning(true);
      setRotation((cur) => rotationForIndex(wheel.segments, res.segmentIndex, cur));
      window.setTimeout(() => {
        setSpinning(false);
        setResult(res);
        setBalance(res.balance);
        queryClient.invalidateQueries({ queryKey: ["history"] });
        if (res.amountWon > 0) toast.success(`You won ${res.amountWon} coins!`);
        else toast(`${res.segment.label} — better luck next time`);
      }, SPIN_DURATION_MS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Spin failed");
    }
  };

  return (
    <Box>
      <Button
        component={RouterLink}
        to={ROUTES.WHEELS}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        All wheels
      </Button>
      <QueryState isLoading={isLoading} isError={isError} error={error} />
      {wheel && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <PageSection sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 800 }}>
                {wheel.name}
              </Typography>
              <SpinWheel
                segments={wheel.segments}
                rotation={rotation}
                spinning={spinning}
                backgroundColor={wheel.backgroundColor}
                borderColor={wheel.borderColor}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleSpin}
                disabled={spinning || effectiveBet == null}
                sx={{ mt: 3, minWidth: 180, fontSize: 18 }}
              >
                {spinning ? "Spinning…" : `SPIN (${effectiveBet ?? "-"})`}
              </Button>
              {result && (
                <Alert
                  severity={result.amountWon > 0 ? "success" : "info"}
                  sx={{ mt: 2, justifyContent: "center" }}
                >
                  {result.segment.label} · {formatSigned(result.amountWon)} coins
                </Alert>
              )}
            </PageSection>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <PageSection>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                Place your bet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {wheel.description}
              </Typography>
              <BetSelector
                betSizes={wheel.betSizes}
                value={effectiveBet}
                onChange={setBet}
                disabled={spinning}
              />
              <Stack spacing={1} sx={{ mt: 3 }}>
                <Typography variant="overline" color="text.secondary">
                  Prizes
                </Typography>
                {wheel.segments.map((s) => (
                  <Stack key={s.id} direction="row" justifyContent="space-between">
                    <Typography variant="body2">
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: s.color,
                          mr: 1,
                        }}
                      />
                      {s.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.prizeType === "nothing" ? "—" : `${s.prizeAmount} ${s.prizeType}`}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </PageSection>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
