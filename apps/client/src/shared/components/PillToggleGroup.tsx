import {
  ToggleButton,
  ToggleButtonGroup,
  type ToggleButtonGroupProps,
} from "@mui/material";
import { pillToggleGroupSx } from "./pillToggleStyles";

export function PillToggleGroup({
  sx,
  ...props
}: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup
      {...props}
      sx={[
        pillToggleGroupSx,
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}

export { ToggleButton };
