import { Chip } from "@mui/material";

interface StatusChipProps {
  status: "draft" | "active" | "inactive";
}

const STATUS_CONFIG = {
  draft: { label: "Draft", color: "default" as const },
  active: { label: "Active", color: "success" as const },
  inactive: { label: "Inactive", color: "warning" as const },
};

export function WheelStatusChip({ status }: StatusChipProps) {
  const config = STATUS_CONFIG[status];
  return <Chip label={config.label} color={config.color} size="small" />;
}
