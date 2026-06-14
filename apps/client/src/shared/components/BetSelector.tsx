import { Stack, Typography } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  PillToggleGroup,
  ToggleButton,
} from "./PillToggleGroup";
import { pillToggleButtonSx } from "./pillToggleStyles";

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
    <Stack spacing={1} sx={{ width: "100%" }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", lineHeight: 1.6 }}
      >
        {label}
      </Typography>
      <PillToggleGroup
        exclusive
        value={value}
        onChange={(_, v) => v != null && onChange(v)}
        disabled={disabled}
      >
        {betSizes.map((bet) => (
          <ToggleButton
            key={bet}
            value={bet}
            sx={(theme) => pillToggleButtonSx(theme)}
          >
            <MonetizationOnIcon
              sx={{
                fontSize: 18,
                mr: 0.5,
                color: "secondary.main",
                ".Mui-selected &": { color: "inherit" },
              }}
            />
            {bet}
          </ToggleButton>
        ))}
      </PillToggleGroup>
    </Stack>
  );
}
