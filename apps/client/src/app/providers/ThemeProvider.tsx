import { useMemo, useState } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeModeContext, type ThemeMode } from "./themeContext";

const STORAGE_KEY = "gaming_theme_mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem(STORAGE_KEY) as ThemeMode) || "dark",
  );

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#7c3aed" }, // violet
          secondary: { main: "#f59e0b" }, // gold
          success: { main: "#22c55e" },
          error: { main: "#ef4444" },
          background:
            mode === "dark"
              ? { default: "#0f0b1e", paper: "#1a1330" }
              : { default: "#f5f3ff", paper: "#ffffff" },
        },
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: "Inter, system-ui, Arial, sans-serif",
          h3: { fontWeight: 800 },
          h4: { fontWeight: 800 },
          button: { textTransform: "none", fontWeight: 700 },
        },
      }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}
