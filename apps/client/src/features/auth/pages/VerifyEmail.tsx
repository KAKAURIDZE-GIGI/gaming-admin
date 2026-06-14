import { useEffect, useRef, useState } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { ROUTES } from "@/shared/lib/routes";
import { authApi } from "../authApi";
import { AuthCard } from "../AuthCard";

type Status = "loading" | "success" | "error";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "" : "Missing verification token.",
  );
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return; // guard StrictMode double-invoke
    ran.current = true;
    authApi
      .verify(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Verification failed");
      });
  }, [token]);

  return (
    <AuthCard title="Email verification">
      <Stack spacing={2} alignItems="center">
        {status === "loading" && (
          <>
            <CircularProgress />
            <Typography color="text.secondary">Verifying your account…</Typography>
          </>
        )}
        {status === "success" && (
          <>
            <Alert severity="success" sx={{ width: "100%" }}>
              {message}
            </Alert>
            <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained" fullWidth>
              Log in
            </Button>
          </>
        )}
        {status === "error" && (
          <>
            <Alert severity="error" sx={{ width: "100%" }}>
              {message}
            </Alert>
            <Button component={RouterLink} to={ROUTES.REGISTER} variant="outlined" fullWidth>
              Back to sign up
            </Button>
          </>
        )}
      </Stack>
    </AuthCard>
  );
}
