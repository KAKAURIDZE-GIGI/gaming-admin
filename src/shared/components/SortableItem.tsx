import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { ReactNode } from "react";

interface SortableItemProps {
  id: string;
  children: ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box ref={setNodeRef} style={style} sx={{ position: "relative" }}>
      <Box
        {...attributes}
        {...listeners}
        sx={{
          position: "absolute",
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
          cursor: "grab",
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          zIndex: 1,
          "&:active": { cursor: "grabbing" },
        }}
      >
        <DragIndicatorIcon fontSize="small" />
      </Box>
      <Box sx={{ pl: 2.5 }}>{children}</Box>
    </Box>
  );
}
