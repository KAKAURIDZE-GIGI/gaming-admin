import { Alert, Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

/** Renders loading / error / empty states for a react-query result. */
export function QueryState({
  isLoading,
  isError,
  error,
  isEmpty,
  emptyText = "Nothing here yet.",
}: {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  isEmpty?: boolean;
  emptyText?: string;
}) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }
  if (isError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error instanceof Error ? error.message : "Failed to load"}
      </Alert>
    );
  }
  if (isEmpty) {
    return (
      <Paper
        elevation={0}
        sx={{
          py: 8,
          px: 3,
          textAlign: "center",
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Stack alignItems="center" spacing={1.5}>
          <InboxOutlinedIcon sx={{ fontSize: 48, color: "text.disabled" }} />
          <Typography color="text.secondary">{emptyText}</Typography>
        </Stack>
      </Paper>
    );
  }
  return null;
}
