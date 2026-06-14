import { z } from "zod";

export const slotSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(80, "Name must be at most 80 characters"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["draft", "active"]),
  winRate: z.coerce
    .number()
    .min(0, "Win rate cannot be negative")
    .max(100, "Win rate cannot exceed 100"),
  betSizes: z
    .array(z.coerce.number().positive("Bet must be greater than 0"))
    .min(1, "Add at least one bet size"),
});

export type SlotSchemaType = z.infer<typeof slotSchema>;
