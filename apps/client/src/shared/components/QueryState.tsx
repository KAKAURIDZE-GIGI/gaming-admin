import { Alert, Box, CircularProgress, Typography } from "@mui/material";

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
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
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
      <Typography color="text.secondary" textAlign="center" sx={{ py: 8 }}>
        {emptyText}
      </Typography>
    );
  }
  return null;
}
