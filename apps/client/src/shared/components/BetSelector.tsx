import { ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

export function BetSelector({
  betSizes,
  value,
  onChange,
  disabled,
  label = "Choose your bet",
}: {
  betSizes: number[];
  value: number | null;
  onChange: (bet: number) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {label}
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(_, v) => v != null && onChange(v)}
        disabled={disabled}
        sx={{ flexWrap: "wrap", gap: 1, mt: 0.5 }}
      >
        {betSizes.map((bet) => (
          <ToggleButton
            key={bet}
            value={bet}
            sx={{
              borderRadius: "999px !important",
              border: "1px solid",
              borderColor: "divider",
              px: 2,
            }}
          >
            <MonetizationOnIcon sx={{ fontSize: 18, mr: 0.5, color: "secondary.main" }} />
            {bet}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
