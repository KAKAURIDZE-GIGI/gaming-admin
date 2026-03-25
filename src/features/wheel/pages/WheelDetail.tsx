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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ROUTES } from "@/shared/lib";
import { useWheelDetail } from "../api";
import { WheelStatusChip, AnimatedWheel } from "../components";

export default function WheelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useWheelDetail(id!);

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
        Failed to load wheel
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
            onClick={() => navigate(ROUTES.WHEEL.LIST)}
          >
            Back
          </Button>
          <Typography variant="h4">{data.name}</Typography>
          <WheelStatusChip status={data.status} />
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(ROUTES.WHEEL.EDIT(id!))}
        >
          Edit
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
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
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Spin Cost
                </Typography>
                <Typography>{data.spinCost}</Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Max Spins Per User
                </Typography>
                <Typography>{data.maxSpinsPerUser}</Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Segments
                </Typography>
                <Typography>{data.segments.length}</Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Background
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      bgcolor: data.backgroundColor,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                  <Typography>{data.backgroundColor}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Border
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: 1,
                      bgcolor: data.borderColor,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                  <Typography>{data.borderColor}</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography>
                  {new Date(data.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Segments ({data.segments.length})
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Color</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell>Weight</TableCell>
                    <TableCell>Prize Type</TableCell>
                    <TableCell>Prize Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.segments.map((seg) => (
                    <TableRow key={seg.id}>
                      <TableCell>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: seg.color,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      </TableCell>
                      <TableCell>{seg.label}</TableCell>
                      <TableCell>{seg.weight}%</TableCell>
                      <TableCell>
                        <Chip label={seg.prizeType} size="small" />
                      </TableCell>
                      <TableCell>{seg.prizeAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, position: "sticky", top: 80 }}>
            <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
              Wheel Preview
            </Typography>
            <AnimatedWheel
              segments={data.segments}
              backgroundColor={data.backgroundColor}
              borderColor={data.borderColor}
              size={350}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
