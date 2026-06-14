import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link as RouterLink } from "react-router-dom";
import toast from "react-hot-toast";
import { Alert, Button, Link, Stack, TextField, Typography } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { ROUTES } from "@/shared/lib/routes";
import { authApi } from "../authApi";
import { AuthCard } from "../AuthCard";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await authApi.register(values);
      setSentTo(values.email);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  if (sentTo) {
    return (
      <AuthCard title="Almost there!" subtitle="One more step to start playing">
        <Stack spacing={2} alignItems="center">
          <MarkEmailReadIcon sx={{ fontSize: 56, color: "success.main" }} />
          <Alert severity="success" sx={{ width: "100%" }}>
            We sent a verification link to <b>{sentTo}</b>. Click it to activate
            your account, then log in.
          </Alert>
          <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained" fullWidth>
            Go to login
          </Button>
        </Stack>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create account" subtitle="Sign up and claim your starting balance">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            autoFocus
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
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
            {isSubmitting ? "Creating…" : "Create account"}
          </Button>
          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Link component={RouterLink} to={ROUTES.LOGIN}>
              Log in
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}
