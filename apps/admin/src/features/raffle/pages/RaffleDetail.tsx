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
import { useRaffleDetail } from "../api";
import { RaffleStatusChip } from "../components";

export default function RaffleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useRaffleDetail(id!);

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
        Failed to load raffle
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
            onClick={() => navigate(ROUTES.RAFFLE.LIST)}
          >
            Back
          </Button>
          <Typography variant="h4">{data.name}</Typography>
          <RaffleStatusChip status={data.status} />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(ROUTES.RAFFLE.EDIT(id!))}
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
              Ticket Price
            </Typography>
            <Typography>{data.ticketPrice}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Max Tickets Per User
            </Typography>
            <Typography>{data.maxTicketsPerUser}</Typography>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Total Ticket Limit
            </Typography>
            <Typography>{data.totalTicketLimit ?? "Unlimited"}</Typography>
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
              Draw Date
            </Typography>
            <Typography>{new Date(data.drawDate).toLocaleString()}</Typography>
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
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.prizes.map((prize) => (
                <TableRow key={prize.id}>
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
                  <TableCell>{prize.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
