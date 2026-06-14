import {
  Box,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  useFieldArray,
  useWatch,
  type Control,
  type FieldErrors,
} from "react-hook-form";
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
import type { WheelSchemaType } from "../schemas";

interface SegmentListFormProps {
  control: Control<WheelSchemaType>;
  errors: FieldErrors<WheelSchemaType>;
}

export function SegmentListForm({ control, errors }: SegmentListFormProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "segments",
  });

  const segments = useWatch({ control, name: "segments" });
  const totalWeight =
    segments?.reduce((sum, s) => sum + (Number(s.weight) || 0), 0) || 0;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleAdd = () => {
    if (fields.length >= 12) return;
    append({
      label: "",
      color:
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0"),
      weight: 0,
      prizeType: "coins",
      prizeAmount: 0,
      imageUrl: "https://placehold.co/60x60",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    move(oldIndex, newIndex);
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">Segments</Typography>
          <Chip
            label={`Total weight: ${totalWeight}/100`}
            color={totalWeight === 100 ? "success" : "error"}
            size="small"
          />
        </Box>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          variant="outlined"
          size="small"
          disabled={fields.length >= 12}
        >
          Add Segment ({fields.length}/12)
        </Button>
      </Box>

      {typeof errors.segments?.message === "string" && (
        <Typography color="error" variant="body2" sx={{ mb: 1 }}>
          {errors.segments.message}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor: segments?.[index]?.color || "#ccc",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                    <Typography variant="subtitle2">
                      Segment #{index + 1}
                    </Typography>
                  </Box>
                  {fields.length > 2 && (
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
                    label="Label"
                    size="small"
                    {...control.register(`segments.${index}.label`)}
                    error={!!errors.segments?.[index]?.label}
                    helperText={errors.segments?.[index]?.label?.message}
                  />
                  <TextField
                    label="Color"
                    size="small"
                    type="color"
                    {...control.register(`segments.${index}.color`)}
                    error={!!errors.segments?.[index]?.color}
                    helperText={errors.segments?.[index]?.color?.message}
                    slotProps={{ input: { sx: { height: 40 } } }}
                  />
                  <TextField
                    label="Weight"
                    size="small"
                    type="number"
                    {...control.register(`segments.${index}.weight`, {
                      valueAsNumber: true,
                    })}
                    error={!!errors.segments?.[index]?.weight}
                    helperText={errors.segments?.[index]?.weight?.message}
                  />
                  <TextField
                    label="Prize Type"
                    size="small"
                    select
                    defaultValue={field.prizeType}
                    {...control.register(`segments.${index}.prizeType`)}
                    error={!!errors.segments?.[index]?.prizeType}
                    helperText={errors.segments?.[index]?.prizeType?.message}
                  >
                    <MenuItem value="coins">Coins</MenuItem>
                    <MenuItem value="freeSpin">Free Spin</MenuItem>
                    <MenuItem value="bonus">Bonus</MenuItem>
                    <MenuItem value="nothing">Nothing</MenuItem>
                  </TextField>
                  <TextField
                    label="Prize Amount"
                    size="small"
                    type="number"
                    {...control.register(`segments.${index}.prizeAmount`, {
                      valueAsNumber: true,
                    })}
                    error={!!errors.segments?.[index]?.prizeAmount}
                    helperText={errors.segments?.[index]?.prizeAmount?.message}
                  />
                  <TextField
                    label="Image URL"
                    size="small"
                    {...control.register(`segments.${index}.imageUrl`)}
                    error={!!errors.segments?.[index]?.imageUrl}
                    helperText={errors.segments?.[index]?.imageUrl?.message}
                  />
                </Box>
              </Paper>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: "center", py: 3 }}>
          No segments added. Click "Add Segment" to start.
        </Typography>
      )}
    </Box>
  );
}
