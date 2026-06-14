import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
          borderColor: "primary.main",
        },
      }}
    >
      <CardActionArea component={RouterLink} to={to} sx={{ height: "100%" }}>
        <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, flex: 1 }}>
              {title}
            </Typography>
            <ArrowForwardIcon sx={{ color: "text.disabled", fontSize: 20 }} />
          </Stack>
          {description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, minHeight: 40, lineHeight: 1.6 }}
            >
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
