import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useCreateLeaderboard } from "../api";
import { LeaderboardForm } from "../components";
import type { LeaderboardSchemaType } from "../schemas";

export default function LeaderboardCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateLeaderboard();

  const handleSubmit = (data: LeaderboardSchemaType) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(ROUTES.LEADERBOARD.LIST),
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Leaderboard
      </Typography>
      <LeaderboardForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </Box>
  );
}
