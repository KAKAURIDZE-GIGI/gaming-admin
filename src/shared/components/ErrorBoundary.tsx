import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
  featureName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[${this.props.featureName || "App"}] Error:`,
      error,
      errorInfo,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            gap: 2,
            p: 4,
          }}
        >
          <ErrorOutlineIcon sx={{ fontSize: 64, color: "error.main" }} />
          <Typography variant="h5" color="error">
            {this.props.featureName
              ? `Something went wrong in ${this.props.featureName}`
              : "Something went wrong"}
          </Typography>
          <Typography color="text.secondary" textAlign="center">
            {this.state.error?.message || "An unexpected error occurred"}
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
