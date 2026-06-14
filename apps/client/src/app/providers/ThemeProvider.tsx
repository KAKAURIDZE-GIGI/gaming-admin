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
          primary: { main: "#7c3aed" },
          secondary: { main: "#f59e0b" },
          success: { main: "#22c55e" },
          error: { main: "#ef4444" },
          background:
            mode === "dark"
              ? { default: "#0f0b1e", paper: "#1a1330" }
              : { default: "#f5f3ff", paper: "#ffffff" },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif",
          h3: { fontWeight: 800, letterSpacing: -0.5 },
          h4: { fontWeight: 800, letterSpacing: -0.5 },
          h5: { fontWeight: 700 },
          h6: { fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 700 },
        },
        components: {
          MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
              root: { borderRadius: 10 },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: { fontWeight: 600 },
            },
          },
          MuiPaper: {
            defaultProps: { elevation: 0 },
          },
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
