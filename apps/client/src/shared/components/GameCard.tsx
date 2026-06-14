import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

export function GameCard({
  to,
  title,
  description,
  icon,
  chips,
}: {
  to: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  chips?: string[];
}) {
  return (
    <Card sx={{ height: "100%", transition: "transform .15s", "&:hover": { transform: "translateY(-4px)" } }}>
      <CardActionArea component={RouterLink} to={to} sx={{ height: "100%" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            {icon}
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
          </Stack>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, minHeight: 40 }}>
              {description}
            </Typography>
          )}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {chips?.map((c) => (
              <Chip key={c} label={c} size="small" variant="outlined" />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
