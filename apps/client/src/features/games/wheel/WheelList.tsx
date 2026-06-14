import { Grid } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import { ROUTES } from "@/shared/lib/routes";
import { GameCard } from "@/shared/components/GameCard";
import { PageHeader } from "@/shared/components/PageLayout";
import { QueryState } from "@/shared/components/QueryState";
import { useWheels } from "../hooks";

export default function WheelList() {
  const { data, isLoading, isError, error } = useWheels();

  return (
    <>
      <PageHeader
        title="Wheels"
        subtitle="Spin the wheel and win instant prizes"
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.length === 0}
        emptyText="No active wheels right now. Check back soon!"
      />
      <Grid container spacing={3}>
        {data?.map((w) => (
          <Grid key={w.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard
              to={ROUTES.WHEEL_PLAY(w.id)}
              title={w.name}
              description={w.description}
              icon={<CasinoIcon color="secondary" />}
              chips={[
                `${w.segments.length} prizes`,
                `Bets: ${w.betSizes.join(" / ")}`,
              ]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
