import { Chip } from "@mui/material";

interface StatusChipProps {
  status: "draft" | "active" | "drawn" | "cancelled";
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "default" as const },
  active: { label: "Active", color: "success" as const },
  drawn: { label: "Drawn", color: "info" as const },
  cancelled: { label: "Cancelled", color: "error" as const },
};

export function RaffleStatusChip({ status }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return <Chip label={config.label} color={config.color} size="small" />;
}
