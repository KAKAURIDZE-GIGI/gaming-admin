import {
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useFieldArray, type Control, type FieldErrors } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/shared/components";
import type { LeaderboardSchemaType } from "../schemas";

interface PrizeListFormProps {
  control: Control<LeaderboardSchemaType>;
  errors: FieldErrors<LeaderboardSchemaType>;
}

export function PrizeListForm({ control, errors }: PrizeListFormProps) {
  const { fields, append, remove, move, update } = useFieldArray({
    control,
    name: "prizes",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAdd = () => {
    append({
      rank: fields.length + 1,
      name: "",
      type: "coins",
      amount: 0,
      imageUrl: "https://placehold.co/100x100",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    move(oldIndex, newIndex);

    // Re-assign sequential ranks after reorder
    fields.forEach((_, i) => {
      const actualIndex =
        i === oldIndex ? newIndex : i === newIndex ? oldIndex : i;
      update(actualIndex, { ...fields[actualIndex], rank: actualIndex + 1 });
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Prizes</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          variant="outlined"
          size="small"
        >
          Add Prize
        </Button>
      </Box>

      {typeof errors.prizes?.message === "string" && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {errors.prizes.message}
        </Typography>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <SortableItem key={field.id} id={field.id}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    Prize #{index + 1}
                  </Typography>
                  {fields.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Rank"
                    type="number"
                    size="small"
                    {...control.register(`prizes.${index}.rank`, {
                      valueAsNumber: true,
                    })}
                    error={!!errors.prizes?.[index]?.rank}
                    helperText={errors.prizes?.[index]?.rank?.message}
                  />
                  <TextField
                    label="Name"
                    size="small"
                    {...control.register(`prizes.${index}.name`)}
                    error={!!errors.prizes?.[index]?.name}
                    helperText={errors.prizes?.[index]?.name?.message}
                  />
                  <TextField
                    label="Type"
                    size="small"
                    select
                    defaultValue={field.type}
                    {...control.register(`prizes.${index}.type`)}
                    error={!!errors.prizes?.[index]?.type}
                    helperText={errors.prizes?.[index]?.type?.message}
                  >
                    <MenuItem value="coins">Coins</MenuItem>
                    <MenuItem value="freeSpin">Free Spin</MenuItem>
                    <MenuItem value="bonus">Bonus</MenuItem>
                  </TextField>
                  <TextField
                    label="Amount"
                    type="number"
                    size="small"
                    {...control.register(`prizes.${index}.amount`, {
                      valueAsNumber: true,
                    })}
                    error={!!errors.prizes?.[index]?.amount}
                    helperText={errors.prizes?.[index]?.amount?.message}
                  />
                  <TextField
                    label="Image URL"
                    size="small"
                    sx={{ gridColumn: "span 2" }}
                    {...control.register(`prizes.${index}.imageUrl`)}
                    error={!!errors.prizes?.[index]?.imageUrl}
                    helperText={errors.prizes?.[index]?.imageUrl?.message}
                  />
                </Box>
              </Paper>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
          No prizes added. Click "Add Prize" to start.
        </Typography>
      )}
    </Box>
  );
}
