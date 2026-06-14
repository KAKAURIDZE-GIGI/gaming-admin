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
  FormControlLabel,
  Switch,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { raffleSchema, type RaffleSchemaType } from "../schemas";
import { RafflePrizeForm } from "./RafflePrizeForm";
import { useUnsavedChanges } from "@/shared/hooks";

interface RaffleFormProps {
  defaultValues?: RaffleSchemaType;
  onSubmit: (data: RaffleSchemaType) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  isDrawn?: boolean;
}

const EMPTY_DEFAULTS: RaffleSchemaType = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  drawDate: "",
  status: "draft",
  ticketPrice: 10,
  maxTicketsPerUser: 1,
  prizes: [
    {
      name: "",
      type: "coins",
      amount: 0,
      quantity: 1,
      imageUrl: "https://placehold.co/100x100",
    },
  ],
  totalTicketLimit: null,
};

export function RaffleForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
  isDrawn,
}: RaffleFormProps) {
  const [hasTicketLimit, setHasTicketLimit] = useState(
    defaultValues?.totalTicketLimit != null,
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<RaffleSchemaType>({
    resolver: zodResolver(raffleSchema),
    defaultValues: defaultValues || EMPTY_DEFAULTS,
  });

  useUnsavedChanges(isDirty);

  if (isDrawn) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          This raffle has already been drawn and cannot be edited.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Basic Information
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
            label="Draw Date"
            type="datetime-local"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("drawDate")}
            error={!!errors.drawDate}
            helperText={errors.drawDate?.message}
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
            <MenuItem value="drawn">Drawn</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ticket Configuration
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          <TextField
            label="Ticket Price"
            type="number"
            fullWidth
            {...register("ticketPrice", { valueAsNumber: true })}
            error={!!errors.ticketPrice}
            helperText={errors.ticketPrice?.message}
          />
          <TextField
            label="Max Tickets Per User"
            type="number"
            fullWidth
            {...register("maxTicketsPerUser", { valueAsNumber: true })}
            error={!!errors.maxTicketsPerUser}
            helperText={errors.maxTicketsPerUser?.message}
          />
          <Box sx={{ gridColumn: "span 2" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={hasTicketLimit}
                  onChange={(e) => setHasTicketLimit(e.target.checked)}
                />
              }
              label="Set total ticket limit"
            />
            {hasTicketLimit && (
              <TextField
                label="Total Ticket Limit"
                type="number"
                fullWidth
                sx={{ mt: 1 }}
                {...register("totalTicketLimit", { valueAsNumber: true })}
                error={!!errors.totalTicketLimit}
                helperText={errors.totalTicketLimit?.message}
              />
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <RafflePrizeForm control={control} errors={errors} />
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
          {mode === "create" ? "Create Raffle" : "Save Changes"}
        </Button>
      </Box>
    </Box>
  );
}
