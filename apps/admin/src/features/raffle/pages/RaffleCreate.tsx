import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useCreateRaffle } from "../api";
import { RaffleForm } from "../components";
import type { RaffleSchemaType } from "../schemas";

export default function RaffleCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateRaffle();

  const handleSubmit = (data: RaffleSchemaType) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(ROUTES.RAFFLE.LIST),
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Raffle
      </Typography>
      <RaffleForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </Box>
  );
}
