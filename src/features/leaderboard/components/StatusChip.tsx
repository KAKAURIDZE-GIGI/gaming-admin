import { Chip } from "@mui/material";

interface StatusChipProps {
  status: "draft" | "active" | "completed";
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "default" as const },
  active: { label: "Active", color: "success" as const },
  completed: { label: "Completed", color: "info" as const },
};

export function StatusChip({ status }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return <Chip label={config.label} color={config.color} size="small" />;
}
