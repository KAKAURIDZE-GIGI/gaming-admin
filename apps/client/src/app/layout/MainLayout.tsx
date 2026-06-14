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
  { label: "Wheels", to: ROUTES.WHEELS },
  { label: "Raffles", to: ROUTES.RAFFLES },
  { label: "Leaderboards", to: ROUTES.LEADERBOARDS },
  { label: "History", to: ROUTES.HISTORY },
];

export function MainLayout() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1} component={RouterLink} to={ROUTES.HOME} sx={{ textDecoration: "none", color: "inherit" }}>
            <CasinoIcon sx={{ color: "secondary.main" }} />
            <Typography variant="h6" sx={{ fontWeight: 800, display: { xs: "none", sm: "block" } }}>
              Gaming
            </Typography>
          </Stack>

          <Stack direction="row" spacing={0.5} sx={{ ml: 2, flexGrow: 1, overflowX: "auto" }}>
            {NAV.map((item) => {
              const active = location.pathname.startsWith(item.to);
              return (
                <Button
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  color={active ? "primary" : "inherit"}
                  variant={active ? "contained" : "text"}
                  size="small"
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          <Chip
            icon={<MonetizationOnIcon />}
            color="secondary"
            label={formatCoins(user?.balance ?? 0)}
            sx={{ fontWeight: 800, fontSize: 15, px: 0.5 }}
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
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
