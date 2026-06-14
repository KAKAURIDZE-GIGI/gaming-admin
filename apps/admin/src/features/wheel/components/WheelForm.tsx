import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Paper,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { wheelSchema, type WheelSchemaType } from "../schemas";
import { SegmentListForm } from "./SegmentListForm";
import { WheelPreview } from "./WheelPreview";
import { useUnsavedChanges } from "@/shared/hooks";
import { BetSizesField } from "@/shared/components";
import type { Control, FieldValues } from "react-hook-form";

interface WheelFormProps {
  defaultValues?: WheelSchemaType;
  onSubmit: (data: WheelSchemaType, markClean: () => void) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

const EMPTY_DEFAULTS: WheelSchemaType = {
  name: "",
  description: "",
  status: "draft",
  segments: [
    {
      label: "Prize 1",
      color: "#EF4444",
      weight: 50,
      prizeType: "coins",
      prizeAmount: 100,
      imageUrl: "https://placehold.co/60x60/EF4444/FFF?text=P1",
    },
    {
      label: "Prize 2",
      color: "#3B82F6",
      weight: 50,
      prizeType: "coins",
      prizeAmount: 200,
      imageUrl: "https://placehold.co/60x60/3B82F6/FFF?text=P2",
    },
  ],
  betSizes: [10, 50, 100],
  maxSpinsPerUser: 1,
  spinCost: 0,
  backgroundColor: "#1F2937",
  borderColor: "#F59E0B",
};

export function WheelForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: WheelFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<WheelSchemaType>({
    resolver: zodResolver(wheelSchema),
    defaultValues: defaultValues || EMPTY_DEFAULTS,
  });

  const { markSaved } = useUnsavedChanges(isDirty);

  // Watch segments and colors for live preview
  const segments = useWatch({ control, name: "segments" });
  const backgroundColor = useWatch({ control, name: "backgroundColor" });
  const borderColor = useWatch({ control, name: "borderColor" });

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
      <Grid container spacing={3}>
        {/* Left column — form */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Basic Information
            </Typography>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
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
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
              <TextField
                label="Max Spins Per User"
                type="number"
                fullWidth
                {...register("maxSpinsPerUser", { valueAsNumber: true })}
                error={!!errors.maxSpinsPerUser}
                helperText={errors.maxSpinsPerUser?.message}
              />
              <TextField
                label="Spin Cost"
                type="number"
                fullWidth
                {...register("spinCost", { valueAsNumber: true })}
                error={!!errors.spinCost}
                helperText={errors.spinCost?.message}
              />
              <Box sx={{ gridColumn: "span 2" }}>
                <BetSizesField
                  control={control as unknown as Control<FieldValues>}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Background Color"
                  type="color"
                  fullWidth
                  {...register("backgroundColor")}
                  error={!!errors.backgroundColor}
                  helperText={errors.backgroundColor?.message}
                  slotProps={{ input: { sx: { height: 56 } } }}
                />
                <TextField
                  label="Border Color"
                  type="color"
                  fullWidth
                  {...register("borderColor")}
                  error={!!errors.borderColor}
                  helperText={errors.borderColor?.message}
                  slotProps={{ input: { sx: { height: 56 } } }}
                />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <SegmentListForm control={control} errors={errors} />
          </Paper>
        </Grid>

        {/* Right column — live preview */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Live Preview
            </Typography>
            <WheelPreview
              segments={segments || []}
              backgroundColor={backgroundColor}
              borderColor={borderColor}
              size={320}
            />
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
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
          {mode === "create" ? "Create Wheel" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
