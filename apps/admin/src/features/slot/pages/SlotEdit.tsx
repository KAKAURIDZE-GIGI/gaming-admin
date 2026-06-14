import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useSlotDetail, useUpdateSlot } from "../api";
import { SlotForm } from "../components";
import type { SlotSchemaType } from "../schemas";

export default function SlotEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSlotDetail(id!);
  const updateMutation = useUpdateSlot(id!);

  const handleSubmit = (formData: SlotSchemaType, markClean: () => void) => {
    updateMutation.mutate(formData, {
      onSuccess: () => {
        markClean();
        navigate(ROUTES.SLOT.DETAIL(id!));
      },
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
        Failed to load slot
      </Typography>
    );
  }

  const defaultValues: SlotSchemaType = {
    name: data.name,
    description: data.description,
    status: data.status,
    winRate: data.winRate,
    betSizes: data.betSizes?.length ? data.betSizes : [5, 10, 25, 50, 100],
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Slot
      </Typography>
      <SlotForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        mode="edit"
      />
    </Box>
  );
}
