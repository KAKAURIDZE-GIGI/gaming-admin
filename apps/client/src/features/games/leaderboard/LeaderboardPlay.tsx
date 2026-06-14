import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CasinoIcon from "@mui/icons-material/Casino";
import { ROUTES } from "@/shared/lib/routes";
import { BetSelector } from "@/shared/components/BetSelector";
import { QueryState } from "@/shared/components/QueryState";
import { useAuth } from "@/features/auth";
import { useLeaderboard } from "../hooks";
import { playApi } from "../api";

export default function LeaderboardPlay() {
  const { id = "" } = useParams();
  const { data: board, isLoading, isError, error } = useLeaderboard(id);
  const { user, setBalance } = useAuth();
  const queryClient = useQueryClient();

  const [bet, setBet] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const standingsQuery = useQuery({
    queryKey: ["standings", id],
    queryFn: () => playApi.standings(id),
    enabled: !!id,
  });

  const effectiveBet = bet ?? board?.betSizes[0] ?? null;

  const handlePlay = async () => {
    if (!board || effectiveBet == null) return;
    if ((user?.balance ?? 0) < effectiveBet) {
      toast.error("Not enough coins");
      return;
    }
    setBusy(true);
    try {
      const res = await playApi.leaderboard(board.id, effectiveBet);
      setBalance(res.balance);
      queryClient.invalidateQueries({ queryKey: ["standings", id] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      const cash = res.cashWon > 0 ? ` · +${res.cashWon} coins` : "";
      toast.success(`+${res.points} pts · rank #${res.rank}${cash}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Play failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Button component={RouterLink} to={ROUTES.LEADERBOARDS} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        All leaderboards
      </Button>
      <QueryState isLoading={isLoading} isError={isError} error={error} />
      {board && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {board.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {board.description}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                <Chip label={`Your rank: ${standingsQuery.data?.myRank ?? "—"}`} color="primary" />
                <Chip label={`Your score: ${standingsQuery.data?.myScore ?? 0}`} variant="outlined" />
              </Stack>
              <BetSelector
                betSizes={board.betSizes}
                value={effectiveBet}
                onChange={setBet}
                disabled={busy}
                label="Stake per round"
              />
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<CasinoIcon />}
                sx={{ mt: 3 }}
                onClick={handlePlay}
                disabled={busy || effectiveBet == null}
              >
                {busy ? "Playing…" : "Play a round"}
              </Button>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Standings
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Player</TableCell>
                    <TableCell align="right">Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {standingsQuery.data?.standings.map((s, i) => (
                    <TableRow key={s.id} selected={s.name === user?.name}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell align="right">{s.score}</TableCell>
                    </TableRow>
                  ))}
                  {standingsQuery.data?.standings.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ color: "text.secondary", py: 3 }}>
                        Be the first to play!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
