import { z } from "zod";

const rafflePrizeSchema = z.object({
  name: z.string().min(1, "Prize name is required"),
  type: z.enum(["coins", "freeSpin", "bonus"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  imageUrl: z.string().url("Must be a valid URL"),
});

export const raffleSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(80, "Name must be at most 80 characters"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    drawDate: z.string().min(1, "Draw date is required"),
    status: z.enum(["draft", "active", "drawn", "cancelled"]),
    ticketPrice: z.coerce
      .number()
      .positive("Ticket price must be a positive number"),
    betSizes: z
      .array(z.coerce.number().positive("Bet must be greater than 0"))
      .min(1, "Add at least one bet size"),
    maxTicketsPerUser: z.coerce.number().int().min(1, "Must be at least 1"),
    prizes: z.array(rafflePrizeSchema).min(1, "At least one prize is required"),
    totalTicketLimit: z.coerce.number().int().positive().nullable(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((data) => new Date(data.drawDate) > new Date(data.endDate), {
    message: "Draw date must be after end date",
    path: ["drawDate"],
  });

export type RaffleSchemaType = z.infer<typeof raffleSchema>;
