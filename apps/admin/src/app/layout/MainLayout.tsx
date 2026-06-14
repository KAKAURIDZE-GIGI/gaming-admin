import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { Sidebar, DRAWER_WIDTH } from "./Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

export function MainLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Breadcrumbs />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
