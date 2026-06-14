import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { ROUTES } from "@/shared/lib/routes";
import { formatCoins } from "@/shared/lib/format";
import { GameCard } from "@/shared/components/GameCard";
import { useAuth } from "@/features/auth";

export default function Lobby() {
  const { user } = useAuth();

  return (
    <Box>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          background: "linear-gradient(120deg, #7c3aed 0%, #4c1d95 100%)",
          color: "#fff",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Welcome back, {user?.name} 👋
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <MonetizationOnIcon sx={{ color: "#fde68a" }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {formatCoins(user?.balance ?? 0)}
          </Typography>
          <Typography sx={{ opacity: 0.8 }}>coins</Typography>
        </Stack>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Pick a game
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GameCard
            to={ROUTES.WHEELS}
            title="Wheel of Fortune"
            description="Spin the wheel and win instant coin prizes."
            icon={<CasinoIcon color="secondary" />}
            chips={["Instant win", "Weighted odds"]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GameCard
            to={ROUTES.RAFFLES}
            title="Raffles"
            description="Buy tickets for a chance at big prize pools."
            icon={<ConfirmationNumberIcon color="secondary" />}
            chips={["Prize draws"]}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <GameCard
            to={ROUTES.LEADERBOARDS}
            title="Leaderboards"
            description="Play rounds, climb the ranks, win rewards."
            icon={<EmojiEventsIcon color="secondary" />}
            chips={["Compete", "Earn points"]}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
