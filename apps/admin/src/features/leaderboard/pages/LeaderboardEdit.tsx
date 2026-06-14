import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useLeaderboardDetail, useUpdateLeaderboard } from "../api";
import { LeaderboardForm } from "../components";
import type { LeaderboardSchemaType } from "../schemas";

export default function LeaderboardEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLeaderboardDetail(id!);
  const updateMutation = useUpdateLeaderboard(id!);

  const handleSubmit = (formData: LeaderboardSchemaType) => {
    updateMutation.mutate(formData, {
      onSuccess: () => navigate(ROUTES.LEADERBOARD.DETAIL(id!)),
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Typography color="error" sx={{ py: 4 }}>
        Failed to load leaderboard
      </Typography>
    );
  }

  const defaultValues: LeaderboardSchemaType = {
    title: data.title,
    description: data.description,
    startDate: data.startDate.slice(0, 16),
    endDate: data.endDate.slice(0, 16),
    status: data.status,
    scoringType: data.scoringType,
    prizes: data.prizes.map((p) => ({
      rank: p.rank,
      name: p.name,
      type: p.type,
      amount: p.amount,
      imageUrl: p.imageUrl,
    })),
    betSizes: data.betSizes?.length ? data.betSizes : [10, 50, 100],
    maxParticipants: data.maxParticipants,
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Leaderboard
      </Typography>
      <LeaderboardForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        mode="edit"
      />
    </Box>
  );
}
