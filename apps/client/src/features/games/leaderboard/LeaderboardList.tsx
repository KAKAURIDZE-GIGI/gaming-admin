import { Grid, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { ROUTES } from "@/shared/lib/routes";
import { GameCard } from "@/shared/components/GameCard";
import { QueryState } from "@/shared/components/QueryState";
import { useLeaderboards } from "../hooks";

export default function LeaderboardList() {
  const { data, isLoading, isError, error } = useLeaderboards();

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Leaderboards
      </Typography>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.length === 0}
        emptyText="No active leaderboards right now."
      />
      <Grid container spacing={3}>
        {data?.map((lb) => (
          <Grid key={lb.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard
              to={ROUTES.LEADERBOARD_PLAY(lb.id)}
              title={lb.title}
              description={lb.description}
              icon={<EmojiEventsIcon color="secondary" />}
              chips={[lb.scoringType, `Bets: ${lb.betSizes.join(" / ")}`]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
