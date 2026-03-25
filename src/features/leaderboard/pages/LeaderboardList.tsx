import FileDownloadIcon from "@mui/icons-material/FileDownload";
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
import { exportToCsv, ROUTES } from "@/shared/lib";
import { useLeaderboardList, useDeleteLeaderboard } from "../api";
import { StatusChip } from "../components";

type SortField =
  | "title"
  | "status"
  | "startDate"
  | "endDate"
  | "maxParticipants";

export default function LeaderboardList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<SortField>("createdAt" as SortField);
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useLeaderboardList({
    page: page + 1,
    limit,
    sortBy,
    order,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const deleteMutation = useDeleteLeaderboard();

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
          Failed to load leaderboards: {error?.message || "Unknown error"}
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
        <Typography variant="h4">Leaderboards</Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            disabled={!data?.data.length}
            onClick={() =>
              exportToCsv("leaderboards", data?.data || [], [
                { key: "title", label: "Title" },
                { key: "status", label: "Status" },
                { key: "scoringType", label: "Scoring Type" },
                { key: "startDate", label: "Start Date" },
                { key: "endDate", label: "End Date" },
                { key: "maxParticipants", label: "Max Participants" },
              ])
            }
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate(ROUTES.LEADERBOARD.CREATE)}
          >
            Create Leaderboard
          </Button>
        </Box>
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
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === "title"}
                  direction={sortBy === "title" ? order : "asc"}
                  onClick={() => handleSort("title")}
                >
                  Title
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
              <TableCell>Scoring</TableCell>
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
                  active={sortBy === "maxParticipants"}
                  direction={sortBy === "maxParticipants" ? order : "asc"}
                  onClick={() => handleSort("maxParticipants")}
                >
                  Max Participants
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
              : data?.data.map((lb) => (
                  <TableRow key={lb.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{lb.title}</TableCell>
                    <TableCell>
                      <StatusChip status={lb.status} />
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {lb.scoringType}
                    </TableCell>
                    <TableCell>
                      {new Date(lb.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(lb.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{lb.maxParticipants}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(ROUTES.LEADERBOARD.DETAIL(lb.id))
                        }
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => navigate(ROUTES.LEADERBOARD.EDIT(lb.id))}
                        title="Edit"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(lb.id)}
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
                    No leaderboards found. Create one to get started.
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

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Leaderboard</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this leaderboard? This action cannot
            be undone.
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
