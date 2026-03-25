import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../lib";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        gap: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: 120, fontWeight: 800, color: "primary.main" }}
      >
        404
      </Typography>
      <Typography variant="h5" color="text.secondary">
        Page not found
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(ROUTES.HOME)}
        sx={{ mt: 2 }}
      >
        Go Home
      </Button>
    </Box>
  );
}
