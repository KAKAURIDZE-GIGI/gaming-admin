import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HistoryIcon from "@mui/icons-material/History";
import { ROUTES } from "@/shared/lib/routes";
import { formatCoins } from "@/shared/lib/format";
import { GameCard } from "@/shared/components/GameCard";
import { PageHeader } from "@/shared/components/PageLayout";
import { useAuth } from "@/features/auth";

export default function Lobby() {
  const { user } = useAuth();

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 4,
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #5b21b6 0%, #312e81 100%)"
              : "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
          Welcome back, {user?.name}
        </Typography>
        <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
          Pick a game below and start playing.
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
          <MonetizationOnIcon sx={{ color: "#fde68a" }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {formatCoins(user?.balance ?? 0)}
          </Typography>
          <Typography sx={{ opacity: 0.75 }}>coins available</Typography>
        </Stack>
      </Paper>

      <PageHeader title="Games" subtitle="Choose your next adventure" />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <GameCard
            to={ROUTES.SLOTS}
            title="Fruit Slots"
            description="Spin the fruit reels across 1, 3 or 9 paylines."
            icon={<VideogameAssetIcon color="secondary" />}
            chips={["Fruits", "1 / 3 / 9 lines"]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <GameCard
            to={ROUTES.WHEELS}
            title="Wheel of Fortune"
            description="Spin the wheel and win instant coin prizes."
            icon={<CasinoIcon color="secondary" />}
            chips={["Instant win", "Weighted odds"]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <GameCard
            to={ROUTES.HISTORY}
            title="Play History"
            description="Review your past bets, outcomes, and balance changes."
            icon={<HistoryIcon color="secondary" />}
            chips={["All games", "Paginated"]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
