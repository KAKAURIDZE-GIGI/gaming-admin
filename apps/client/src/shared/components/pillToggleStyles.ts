import type { Theme } from "@mui/material/styles";

/** Separated pill toggles — fixes MUI grouped border overlap / double-outline glitches. */
export const pillToggleGroupSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  width: "100%",
  "& .MuiToggleButtonGroup-grouped": {
    margin: 0,
    border: "1px solid",
    borderColor: "divider",
    borderRadius: "999px !important",
    "&:not(:first-of-type)": {
      marginLeft: 0,
      borderLeft: "1px solid",
      borderColor: "divider",
    },
    "&.Mui-selected": {
      borderColor: "primary.main",
      bgcolor: "primary.main",
      color: "primary.contrastText",
      "&:hover": {
        bgcolor: "primary.dark",
      },
    },
  },
} satisfies Record<string, unknown>;

export function pillToggleButtonSx(theme: Theme) {
  return {
    px: 2,
    py: 0.75,
    textTransform: "none",
    fontWeight: 700,
    border: "none",
    borderRadius: "999px !important",
    "&.Mui-selected": {
      border: "none",
    },
    "&:hover": {
      bgcolor: theme.palette.action.hover,
    },
  };
}
