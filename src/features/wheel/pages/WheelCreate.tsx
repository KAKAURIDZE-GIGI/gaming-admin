import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useCreateWheel } from "../api";
import { WheelForm } from "../components";
import type { WheelSchemaType } from "../schemas";

export default function WheelCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateWheel();

  const handleSubmit = (data: WheelSchemaType) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(ROUTES.WHEEL.LIST),
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Wheel
      </Typography>
      <WheelForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </Box>
  );
}
