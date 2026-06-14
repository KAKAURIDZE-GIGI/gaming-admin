import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import { ROUTES } from "@/shared/lib/routes";
import { useAuth } from "../useAuth";
import { AuthCard } from "../AuthCard";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  if (!isLoading && isAuthenticated) return <Navigate to={ROUTES.HOME} replace />;

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values);
      navigate(ROUTES.HOME, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to keep playing">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            autoFocus
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Log in"}
          </Button>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            New here?{" "}
            <Link component={RouterLink} to={ROUTES.REGISTER}>
              Create an account
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}
