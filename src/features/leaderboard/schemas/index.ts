import { z } from "zod";

const prizeSchema = z.object({
  rank: z.coerce.number().int().positive("Rank must be positive"),
  name: z.string().min(1, "Prize name is required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  imageUrl: z.string().url("Must be a valid URL"),
});

export const leaderboardSchema = z
  .object({
    title: z
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be at most 100 characters"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(["draft", "active", "completed"]),
    scoringType: z.enum(["points", "wins", "wagered"]),
    prizes: z.array(prizeSchema).min(1, "At least one prize is required"),
    maxParticipants: z.coerce
      .number()
      .int("Must be a whole number")
      .min(2, "Minimum 2 participants"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const ranks = data.prizes.map((p) => p.rank);
      const uniqueRanks = new Set(ranks);
      if (ranks.length !== uniqueRanks.size) return false;
      const sorted = [...ranks].sort((a, b) => a - b);
      return sorted.every((r, i) => r === i + 1);
    },
    {
      message: "Prize ranks must be unique and sequential starting from 1",
      path: ["prizes"],
    },
  );

export type LeaderboardSchemaType = z.infer<typeof leaderboardSchema>;
