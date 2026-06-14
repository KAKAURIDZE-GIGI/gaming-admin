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
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { leaderboardSchema, type LeaderboardSchemaType } from "../schemas";
import { PrizeListForm } from "./PrizeListForm";
import { useUnsavedChanges } from "@/shared/hooks";
import { BetSizesField } from "@/shared/components";
import type { Control, FieldValues } from "react-hook-form";

interface LeaderboardFormProps {
  defaultValues?: LeaderboardSchemaType;
  onSubmit: (data: LeaderboardSchemaType) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

const EMPTY_DEFAULTS: LeaderboardSchemaType = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "draft",
  scoringType: "points",
  prizes: [
    {
      rank: 1,
      name: "",
      type: "coins",
      amount: 0,
      imageUrl: "https://placehold.co/100x100",
    },
  ],
  betSizes: [10, 50, 100],
  maxParticipants: 100,
};

export function LeaderboardForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: LeaderboardFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<LeaderboardSchemaType>({
    resolver: zodResolver(leaderboardSchema),
    defaultValues: defaultValues || EMPTY_DEFAULTS,
  });

  useUnsavedChanges(isDirty);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Information
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Title"
            fullWidth
            sx={{ gridColumn: "span 2" }}
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
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
            label="Start Date"
            type="datetime-local"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("startDate")}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
          />
          <TextField
            label="End Date"
            type="datetime-local"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("endDate")}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
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
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
          <TextField
            label="Scoring Type"
            select
            fullWidth
            defaultValue={defaultValues?.scoringType || "points"}
            {...register("scoringType")}
            error={!!errors.scoringType}
            helperText={errors.scoringType?.message}
          >
            <MenuItem value="points">Points</MenuItem>
            <MenuItem value="wins">Wins</MenuItem>
            <MenuItem value="wagered">Wagered</MenuItem>
          </TextField>
          <TextField
            label="Max Participants"
            type="number"
            fullWidth
            {...register("maxParticipants", { valueAsNumber: true })}
            error={!!errors.maxParticipants}
            helperText={errors.maxParticipants?.message}
          />
          <Box sx={{ gridColumn: "span 2" }}>
            <BetSizesField
              control={control as unknown as Control<FieldValues>}
            />
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <PrizeListForm control={control} errors={errors} />
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
          {mode === "create" ? "Create Leaderboard" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
