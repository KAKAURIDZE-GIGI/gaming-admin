import { z } from "zod";

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

const segmentSchema = z
  .object({
    label: z.string().min(1, "Label is required"),
    color: z
      .string()
      .regex(hexColorRegex, "Must be a valid hex color (e.g. #FF0000)"),
    weight: z.coerce
      .number()
      .int()
      .min(1, "Weight must be at least 1")
      .max(100, "Weight must be at most 100"),
    prizeType: z.enum(["coins", "freeSpin", "bonus", "nothing"]),
    prizeAmount: z.coerce.number().min(0, "Amount cannot be negative"),
    imageUrl: z.string().url("Must be a valid URL"),
  })
  .refine(
    (data) => {
      if (data.prizeType === "nothing") return data.prizeAmount === 0;
      return data.prizeAmount > 0;
    },
    {
      message: 'Amount must be 0 for "nothing" and > 0 for other types',
      path: ["prizeAmount"],
    },
  );

export const wheelSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(80, "Name must be at most 80 characters"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["draft", "active", "inactive"]),
    segments: z
      .array(segmentSchema)
      .min(2, "Minimum 2 segments required")
      .max(12, "Maximum 12 segments allowed"),
    betSizes: z
      .array(z.coerce.number().positive("Bet must be greater than 0"))
      .min(1, "Add at least one bet size"),
    maxSpinsPerUser: z.coerce.number().int().min(1, "Must be at least 1"),
    spinCost: z.coerce.number().min(0, "Must be 0 or more"),
    backgroundColor: z
      .string()
      .regex(hexColorRegex, "Must be a valid hex color"),
    borderColor: z.string().regex(hexColorRegex, "Must be a valid hex color"),
  })
  .refine(
    (data) => {
      const totalWeight = data.segments.reduce((sum, s) => sum + s.weight, 0);
      return totalWeight === 100;
    },
    {
      message: "Segment weights must sum to exactly 100",
      path: ["segments"],
    },
  );

export type WheelSchemaType = z.infer<typeof wheelSchema>;
