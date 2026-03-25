import { useLocation, Link as RouterLink } from "react-router-dom";
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const LABEL_MAP: Record<string, string> = {
  leaderboards: "Leaderboards",
  raffles: "Raffles",
  wheels: "Wheels",
  create: "Create",
  edit: "Edit",
};

export function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ mb: 2 }}
    >
      <Link
        component={RouterLink}
        to="/"
        underline="hover"
        color="text.secondary"
        sx={{ fontSize: 14 }}
      >
        Home
      </Link>
      {segments.map((segment, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const label = LABEL_MAP[segment] || segment;

        if (isLast) {
          return (
            <Typography
              key={path}
              sx={{ fontSize: 14, fontWeight: 500 }}
              color="text.primary"
            >
              {label}
            </Typography>
          );
        }

        return (
          <Link
            key={path}
            component={RouterLink}
            to={path}
            underline="hover"
            color="text.secondary"
            sx={{ fontSize: 14 }}
          >
            {label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
