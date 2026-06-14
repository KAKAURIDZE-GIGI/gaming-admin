import { useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "@/shared/lib/routes";
import { formatCoins } from "@/shared/lib/format";
import { BetSelector } from "@/shared/components/BetSelector";
import { QueryState } from "@/shared/components/QueryState";
import { useAuth } from "@/features/auth";
import { useRaffle } from "../hooks";
import { playApi } from "../api";

export default function RafflePlay() {
  const { id = "" } = useParams();
  const { data: raffle, isLoading, isError, error } = useRaffle(id);
  const { user, setBalance } = useAuth();
  const queryClient = useQueryClient();

  const [bet, setBet] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  const effectiveBet = bet ?? raffle?.betSizes[0] ?? null;
  const cost = (effectiveBet ?? 0) * quantity;

  const handleBuy = async () => {
    if (!raffle || effectiveBet == null) return;
    if ((user?.balance ?? 0) < cost) {
      toast.error("Not enough coins");
      return;
    }
    setBusy(true);
    try {
      const res = await playApi.raffle(raffle.id, effectiveBet, quantity);
      setBalance(res.balance);
      queryClient.invalidateQueries({ queryKey: ["history"] });
      toast.success(`Bought ${res.tickets} ticket(s)! You now hold ${res.totalTickets}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Button component={RouterLink} to={ROUTES.RAFFLES} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        All raffles
      </Button>
      <QueryState isLoading={isLoading} isError={isError} error={error} />
      {raffle && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {raffle.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {raffle.description}
              </Typography>
              <Typography variant="overline" color="text.secondary">
                Prize pool
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Prize</TableCell>
                    <TableCell align="right">Reward</TableCell>
                    <TableCell align="right">Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {raffle.prizes.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell align="right">{p.amount} {p.type}</TableCell>
                      <TableCell align="right">{p.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Buy tickets
              </Typography>
              <BetSelector
                betSizes={raffle.betSizes}
                value={effectiveBet}
                onChange={setBet}
                disabled={busy}
                label="Price per ticket"
              />
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                sx={{ mt: 3 }}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.floor(Number(e.target.value) || 1)))}
                slotProps={{ htmlInput: { min: 1, max: raffle.maxTicketsPerUser || undefined } }}
                helperText={raffle.maxTicketsPerUser ? `Max ${raffle.maxTicketsPerUser} per user` : undefined}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography color="text.secondary">Total cost</Typography>
                <Typography sx={{ fontWeight: 800 }}>{formatCoins(cost)} coins</Typography>
              </Stack>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleBuy}
                disabled={busy || effectiveBet == null}
              >
                {busy ? "Buying…" : "Buy tickets"}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
