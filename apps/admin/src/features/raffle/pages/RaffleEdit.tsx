import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useRaffleDetail, useUpdateRaffle } from "../api";
import { RaffleForm } from "../components";
import type { RaffleSchemaType } from "../schemas";

export default function RaffleEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useRaffleDetail(id!);
  const updateMutation = useUpdateRaffle(id!);

  const handleSubmit = (formData: RaffleSchemaType) => {
    updateMutation.mutate(formData, {
      onSuccess: () => navigate(ROUTES.RAFFLE.DETAIL(id!)),
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
        Failed to load raffle
      </Typography>
    );
  }

  const defaultValues: RaffleSchemaType = {
    name: data.name,
    description: data.description,
    startDate: data.startDate.slice(0, 16),
    endDate: data.endDate.slice(0, 16),
    drawDate: data.drawDate.slice(0, 16),
    status: data.status,
    ticketPrice: data.ticketPrice,
    betSizes: data.betSizes?.length ? data.betSizes : [data.ticketPrice || 10],
    maxTicketsPerUser: data.maxTicketsPerUser,
    prizes: data.prizes.map((p) => ({
      name: p.name,
      type: p.type,
      amount: p.amount,
      quantity: p.quantity,
      imageUrl: p.imageUrl,
    })),
    totalTicketLimit: data.totalTicketLimit,
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Raffle
      </Typography>
      <RaffleForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        mode="edit"
        isDrawn={data.status === "drawn"}
      />
    </Box>
  );
}
