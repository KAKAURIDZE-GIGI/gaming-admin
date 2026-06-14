import { useState } from "react";
import { useController, type Control, type FieldValues } from "react-hook-form";
import { TextField } from "@mui/material";

function parse(text: string): number[] {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map(Number);
}

interface BetSizesFieldProps {
  // Forms use distinct schema types; betSizes is always number[].
  control: Control<FieldValues>;
  name?: string;
}

/**
 * Comma-separated editor for a `number[]` bet-sizes field. Players pick one of
 * these stakes when playing the game on the client.
 */
export function BetSizesField({
  control,
  name = "betSizes",
}: BetSizesFieldProps) {
  const { field, fieldState } = useController({ control, name });
  // Local text mirrors the array so users can type freely (commas, spaces).
  // The form value is the source of truth at mount (forms supply defaultValues),
  // so initializing from it once is sufficient — no external resets occur here.
  const [text, setText] = useState<string>(() =>
    ((field.value as number[]) ?? []).join(", "),
  );

  return (
    <TextField
      label="Bet sizes"
      placeholder="e.g. 10, 50, 100"
      fullWidth
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        field.onChange(parse(e.target.value));
      }}
      onBlur={field.onBlur}
      error={!!fieldState.error}
      helperText={
        fieldState.error?.message ||
        "Comma-separated stakes players can choose from"
      }
    />
  );
}
