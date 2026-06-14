import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROUTES } from "@/shared/lib/routes";
import { formatCoins } from "@/shared/lib/format";
import { useAuth } from "@/features/auth";
import { useThemeMode } from "@/app/providers/useThemeMode";

const NAV = [
  { label: "Home", to: ROUTES.HOME },
  { label: "Slots", to: ROUTES.SLOTS },
  { label: "Wheels", to: ROUTES.WHEELS },
  { label: "History", to: ROUTES.HISTORY },
];

export function MainLayout() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();

  const isActive = (path: string) =>
    path === ROUTES.HOME
      ? location.pathname === ROUTES.HOME
      : location.pathname.startsWith(path);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(8px)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(15, 11, 30, 0.85)"
              : "rgba(255, 255, 255, 0.85)",
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: { xs: 56, sm: 64 } }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            component={RouterLink}
            to={ROUTES.HOME}
            sx={{ textDecoration: "none", color: "inherit", flexShrink: 0 }}
          >
            <CasinoIcon sx={{ color: "secondary.main" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, display: { xs: "none", sm: "block" } }}
            >
              Gaming
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              ml: { xs: 0, sm: 1 },
              flexGrow: 1,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {NAV.map((item) => {
              const active = isActive(item.to);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  color={active ? "primary" : "inherit"}
                  variant={active ? "contained" : "text"}
                  size="small"
                  sx={{ flexShrink: 0, px: { xs: 1.5, sm: 2 } }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
            <Chip
              icon={<MonetizationOnIcon />}
              color="secondary"
              label={formatCoins(user?.balance ?? 0)}
              sx={{ fontWeight: 800, fontSize: { xs: 13, sm: 15 }, px: 0.5 }}
            />
            <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
              <IconButton onClick={toggleMode} size="small">
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Log out">
              <IconButton onClick={logout} size="small" color="error">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, px: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
