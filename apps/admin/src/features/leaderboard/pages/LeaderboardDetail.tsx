import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "@/shared/lib";
import { useLeaderboardDetail } from "../api";
import { StatusChip } from "../components";

export default function LeaderboardDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLeaderboardDetail(id!);

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
        Failed to load leaderboard
      </Typography>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(ROUTES.LEADERBOARD.LIST)}
          >
            Back
          </Button>
          <Typography variant="h4">{data.title}</Typography>
          <StatusChip status={data.status} />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(ROUTES.LEADERBOARD.EDIT(id!))}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Details
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography>{data.description}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Scoring Type
            </Typography>
            <Chip
              label={data.scoringType}
              size="small"
              sx={{ textTransform: "capitalize", mt: 0.5 }}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Max Participants
            </Typography>
            <Typography>{data.maxParticipants}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Start Date
            </Typography>
            <Typography>{new Date(data.startDate).toLocaleString()}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              End Date
            </Typography>
            <Typography>{new Date(data.endDate).toLocaleString()}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Created
            </Typography>
            <Typography>{new Date(data.createdAt).toLocaleString()}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Updated
            </Typography>
            <Typography>{new Date(data.updatedAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Prizes ({data.prizes.length})
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.prizes
                .sort((a, b) => a.rank - b.rank)
                .map((prize) => (
                  <TableRow key={prize.id}>
                    <TableCell>#{prize.rank}</TableCell>
                    <TableCell>
                      <Avatar
                        src={prize.imageUrl}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      />
                    </TableCell>
                    <TableCell>{prize.name}</TableCell>
                    <TableCell>
                      <Chip label={prize.type} size="small" />
                    </TableCell>
                    <TableCell>{prize.amount}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
