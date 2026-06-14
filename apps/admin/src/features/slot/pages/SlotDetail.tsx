import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "@/shared/lib";
import { useSlotDetail } from "../api";
import { StatusChip } from "../components";

export default function SlotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useSlotDetail(id!);

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

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(ROUTES.SLOT.LIST)}>
            Back
          </Button>
          <Typography variant="h4">{data.name}</Typography>
          <StatusChip status={data.status} />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(ROUTES.SLOT.EDIT(data.id))}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {data.description}
        </Typography>
        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Win rate
            </Typography>
            <Typography variant="h5">{data.winRate}%</Typography>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Bet sizes
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {data.betSizes.map((b) => (
                <Chip key={b} label={b} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
