import { describe, it, expect } from "vitest";
import { raffleSchema } from "../index";

const validData = {
  name: "Spring Raffle",
  description: "A spring raffle event",
  startDate: "2026-03-01T00:00",
  endDate: "2026-03-15T23:59",
  drawDate: "2026-03-16T18:00",
  status: "draft" as const,
  ticketPrice: 100,
  betSizes: [10, 50, 100],
  maxTicketsPerUser: 5,
  prizes: [
    {
      name: "Jackpot",
      type: "coins" as const,
      amount: 50000,
      quantity: 1,
      imageUrl: "https://example.com/img.png",
    },
  ],
  totalTicketLimit: 1000,
};

describe("raffleSchema", () => {
  it("should accept valid data", () => {
    const result = raffleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Name validation
  it("should reject empty name", () => {
    const result = raffleSchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
  });

  it("should reject name shorter than 3 characters", () => {
    const result = raffleSchema.safeParse({ ...validData, name: "AB" });
    expect(result.success).toBe(false);
  });

  it("should reject name longer than 80 characters", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      name: "A".repeat(81),
    });
    expect(result.success).toBe(false);
  });

  // Date validation
  it("should reject endDate before startDate", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      startDate: "2026-04-01T00:00",
      endDate: "2026-03-01T00:00",
      drawDate: "2026-04-02T00:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("endDate"))).toBe(
        true,
      );
    }
  });

  it("should reject drawDate before endDate", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      startDate: "2026-03-01T00:00",
      endDate: "2026-03-15T23:59",
      drawDate: "2026-03-14T00:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("drawDate"))).toBe(
        true,
      );
    }
  });

  it("should reject drawDate equal to endDate", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      drawDate: validData.endDate,
    });
    expect(result.success).toBe(false);
  });

  // Ticket validation
  it("should reject negative ticketPrice", () => {
    const result = raffleSchema.safeParse({ ...validData, ticketPrice: -10 });
    expect(result.success).toBe(false);
  });

  it("should reject zero ticketPrice", () => {
    const result = raffleSchema.safeParse({ ...validData, ticketPrice: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject maxTicketsPerUser less than 1", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      maxTicketsPerUser: 0,
    });
    expect(result.success).toBe(false);
  });

  // Prizes
  it("should reject empty prizes", () => {
    const result = raffleSchema.safeParse({ ...validData, prizes: [] });
    expect(result.success).toBe(false);
  });

  it("should reject prize with quantity less than 1", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      prizes: [
        {
          name: "Bad Prize",
          type: "coins",
          amount: 100,
          quantity: 0,
          imageUrl: "https://example.com/a.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should reject prize without a name", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      prizes: [
        {
          name: "",
          type: "coins",
          amount: 100,
          quantity: 1,
          imageUrl: "https://example.com/a.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  // Null ticket limit
  it("should accept null totalTicketLimit (unlimited)", () => {
    const result = raffleSchema.safeParse({
      ...validData,
      totalTicketLimit: null,
    });
    expect(result.success).toBe(true);
  });

  // Status
  it("should accept all valid statuses", () => {
    for (const status of ["draft", "active", "drawn", "cancelled"] as const) {
      const result = raffleSchema.safeParse({ ...validData, status });
      expect(result.success).toBe(true);
    }
  });

  it("should reject invalid status", () => {
    const result = raffleSchema.safeParse({ ...validData, status: "pending" });
    expect(result.success).toBe(false);
  });
});
