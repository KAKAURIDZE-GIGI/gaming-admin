import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { slotSchema, type SlotSchemaType } from "../schemas";
import { useUnsavedChanges } from "@/shared/hooks";
import { BetSizesField } from "@/shared/components";
import type { Control, FieldValues } from "react-hook-form";

interface SlotFormProps {
  defaultValues?: SlotSchemaType;
  onSubmit: (data: SlotSchemaType, markClean: () => void) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

const EMPTY_DEFAULTS: SlotSchemaType = {
  name: "",
  description: "",
  status: "draft",
  winRate: 30,
  betSizes: [5, 10, 25, 50, 100],
};

export function SlotForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: SlotFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<SlotSchemaType>({
    resolver: zodResolver(slotSchema),
    defaultValues: defaultValues || EMPTY_DEFAULTS,
  });

  const { markSaved } = useUnsavedChanges(isDirty);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit((data) =>
        onSubmit(data, () => {
          markSaved();
          reset(data);
        }),
      )}
      noValidate
    >
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Slot Configuration
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Name"
            fullWidth
            sx={{ gridColumn: "span 2" }}
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            sx={{ gridColumn: "span 2" }}
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <TextField
            label="Status"
            select
            fullWidth
            defaultValue={defaultValues?.status || "draft"}
            {...register("status")}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
          </TextField>
          <TextField
            label="Win Rate"
            type="number"
            fullWidth
            {...register("winRate", { valueAsNumber: true })}
            error={!!errors.winRate}
            helperText={
              errors.winRate?.message ||
              "Chance (0-100%) that a spin wins. Server-enforced."
            }
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
            }}
          />
          <Box sx={{ gridColumn: "span 2" }}>
            <BetSizesField
              control={control as unknown as Control<FieldValues>}
            />
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          disabled={isSubmitting}
        >
          {mode === "create" ? "Create Slot" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
