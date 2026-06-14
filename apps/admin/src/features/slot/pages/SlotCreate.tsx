import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ROUTES } from "@/shared/lib";
import { useCreateSlot } from "../api";
import { SlotForm } from "../components";
import type { SlotSchemaType } from "../schemas";

export default function SlotCreate() {
  const navigate = useNavigate();
  const createMutation = useCreateSlot();

  const handleSubmit = (data: SlotSchemaType) => {
    createMutation.mutate(data, {
      onSuccess: () => navigate(ROUTES.SLOT.LIST),
    });
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Slot
      </Typography>
      <SlotForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </Box>
  );
}
