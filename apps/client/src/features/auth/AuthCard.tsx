import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        background:
          "radial-gradient(circle at 30% 20%, rgba(124,58,237,0.25), transparent 60%)",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, boxShadow: 8 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <CasinoIcon sx={{ fontSize: 44, color: "secondary.main" }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {subtitle}
              </Typography>
            )}
          </Stack>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}
