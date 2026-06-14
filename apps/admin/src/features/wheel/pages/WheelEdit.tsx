import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useWheelDetail, useUpdateWheel } from "../api";
import { WheelForm } from "../components";
import type { WheelSchemaType } from "../schemas";

export default function WheelEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useWheelDetail(id!);
  const updateMutation = useUpdateWheel(id!);

  const handleSubmit = (formData: WheelSchemaType) => {
    updateMutation.mutate(formData, {
      onSuccess: () => navigate(ROUTES.WHEEL.DETAIL(id!)),
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
        Failed to load wheel
      </Typography>
    );
  }

  const defaultValues: WheelSchemaType = {
    name: data.name,
    description: data.description,
    status: data.status,
    segments: data.segments.map((s) => ({
      label: s.label,
      color: s.color,
      weight: s.weight,
      prizeType: s.prizeType,
      prizeAmount: s.prizeAmount,
      imageUrl: s.imageUrl,
    })),
    betSizes: data.betSizes?.length ? data.betSizes : [data.spinCost || 10],
    maxSpinsPerUser: data.maxSpinsPerUser,
    spinCost: data.spinCost,
    backgroundColor: data.backgroundColor,
    borderColor: data.borderColor,
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Wheel
      </Typography>
      <WheelForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        mode="edit"
      />
    </Box>
  );
}
