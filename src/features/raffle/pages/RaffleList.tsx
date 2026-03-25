import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  MenuItem,
  IconButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ROUTES } from "@/shared/lib";
import { useRaffleList, useDeleteRaffle } from "../api";
import { RaffleStatusChip } from "../components";

type SortField =
  | "name"
  | "status"
  | "startDate"
  | "endDate"
  | "drawDate"
  | "ticketPrice";

export default function RaffleList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>("startDate");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useRaffleList({
    page: page + 1,
    limit,
    sortBy,
    order,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const deleteMutation = useDeleteRaffle();

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  if (isError) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error">
          Failed to load raffles: {error?.message || "Unknown error"}
        </Typography>
      </Box>
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
        <Typography variant="h4">Raffles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate(ROUTES.RAFFLE.CREATE)}
        >
          Create Raffle
        </Button>
      </Box>

      <Paper sx={{ mb: 2, p: 2 }}>
        <TextField
          select
          label="Status"
          size="small"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="drawn">Drawn</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </TextField>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? order : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "status"}
                  direction={sortBy === "status" ? order : "asc"}
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "ticketPrice"}
                  direction={sortBy === "ticketPrice" ? order : "asc"}
                  onClick={() => handleSort("ticketPrice")}
                >
                  Ticket Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "startDate"}
                  direction={sortBy === "startDate" ? order : "asc"}
                  onClick={() => handleSort("startDate")}
                >
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "endDate"}
                  direction={sortBy === "endDate" ? order : "asc"}
                  onClick={() => handleSort("endDate")}
                >
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "drawDate"}
                  direction={sortBy === "drawDate" ? order : "asc"}
                  onClick={() => handleSort("drawDate")}
                >
                  Draw Date
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : data?.data.map((raffle) => (
                  <TableRow key={raffle.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {raffle.name}
                    </TableCell>
                    <TableCell>
                      <RaffleStatusChip status={raffle.status} />
                    </TableCell>
                    <TableCell>{raffle.ticketPrice}</TableCell>
                    <TableCell>
                      {new Date(raffle.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(raffle.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(raffle.drawDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(ROUTES.RAFFLE.DETAIL(raffle.id))
                        }
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(ROUTES.RAFFLE.EDIT(raffle.id))}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(raffle.id)}
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && data?.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary">
                    No raffles found. Create one to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.total || 0}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Raffle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this raffle? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
