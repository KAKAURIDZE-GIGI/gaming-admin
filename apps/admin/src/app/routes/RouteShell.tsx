import { Suspense, type ReactNode } from "react";
import { CircularProgress, Box } from "@mui/material";
import { ErrorBoundary } from "@/shared/components";

function PageLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 400,
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export function RouteShell({
  children,
  feature,
}: {
  children: ReactNode;
  feature?: string;
}) {
  return (
    <ErrorBoundary featureName={feature}>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}
