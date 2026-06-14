import { Grid } from "@mui/material";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import { ROUTES } from "@/shared/lib/routes";
import { GameCard } from "@/shared/components/GameCard";
import { PageHeader } from "@/shared/components/PageLayout";
import { QueryState } from "@/shared/components/QueryState";
import { useSlots } from "../hooks";

export default function SlotList() {
  const { data, isLoading, isError, error } = useSlots();

  return (
    <>
      <PageHeader
        title="Slots"
        subtitle="Classic fruit reels with multiple paylines"
      />
      <QueryState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.length === 0}
        emptyText="No active slots right now."
      />
      <Grid container spacing={3}>
        {data?.map((s) => (
          <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <GameCard
              to={ROUTES.SLOT_PLAY(s.id)}
              title={s.name}
              description={s.description}
              icon={<VideogameAssetIcon color="secondary" />}
              chips={["Fruits", `Bets: ${s.betSizes.join(" / ")}`]}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
