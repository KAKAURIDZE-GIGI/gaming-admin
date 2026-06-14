import { Grid, Typography } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { ROUTES } from "@/shared/lib/routes";
import { GameCard } from "@/shared/components/GameCard";
import { QueryState } from "@/shared/components/QueryState";
import { useRaffles } from "../hooks";

export default function RaffleList() {
  const { data, isLoading, isError, error } = useRaffles();

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Raffles
      </Typography>
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.length === 0}
        emptyText="No active raffles right now."
      />
      <Grid container spacing={3}>
        {data?.map((r) => (
          <Grid key={r.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard
              to={ROUTES.RAFFLE_PLAY(r.id)}
              title={r.name}
              description={r.description}
              icon={<ConfirmationNumberIcon color="secondary" />}
              chips={[`${r.prizes.length} prizes`, `Ticket: ${r.betSizes.join(" / ")}`]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
