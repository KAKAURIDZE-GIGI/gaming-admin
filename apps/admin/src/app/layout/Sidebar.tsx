import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import LeaderboardIcon from "@mui/icons-material/EmojiEvents";
import RaffleIcon from "@mui/icons-material/ConfirmationNumber";
import WheelIcon from "@mui/icons-material/Casino";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROUTES } from "@/shared/lib";
import { useThemeMode } from "@/app/providers/useThemeMode";
import { useAuth } from "@/features/auth";

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  {
    label: "Leaderboards",
    path: ROUTES.LEADERBOARD.LIST,
    icon: <LeaderboardIcon />,
  },
  { label: "Raffles", path: ROUTES.RAFFLE.LIST, icon: <RaffleIcon /> },
  { label: "Wheels", path: ROUTES.WHEEL.LIST, icon: <WheelIcon /> },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const { admin, logout } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            py: 1,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WheelIcon sx={{ color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "primary.main" }}
            >
              Gaming Admin
            </Typography>
          </Box>
          <IconButton
            onClick={toggleMode}
            size="small"
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            {mode === "light" ? (
              <DarkModeIcon fontSize="small" />
            ) : (
              <LightModeIcon fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, mt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActive ? "primary.main" : "transparent",
                color: isActive ? "white" : "text.primary",
                "&:hover": {
                  bgcolor: isActive ? "primary.dark" : "action.hover",
                },
                "& .MuiListItemIcon-root": {
                  color: isActive ? "white" : "text.secondary",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 1.5 }}>
        {admin && (
          <Box sx={{ px: 1, pb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {admin.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {admin.email}
            </Typography>
          </Box>
        )}
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: "error.main",
            "& .MuiListItemIcon-root": { color: "error.main" },
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
