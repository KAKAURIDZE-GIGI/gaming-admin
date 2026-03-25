import { describe, it, expect } from "vitest";
import { leaderboardSchema } from "../index";

const validData = {
  title: "Weekly Race",
  description: "A weekly competition",
  startDate: "2026-03-01T00:00",
  endDate: "2026-03-31T23:59",
  status: "draft" as const,
  scoringType: "points" as const,
  prizes: [
    {
      rank: 1,
      name: "Gold",
      type: "coins" as const,
      amount: 1000,
      imageUrl: "https://example.com/img.png",
    },
  ],
  maxParticipants: 100,
};

describe("leaderboardSchema", () => {
  it("should accept valid data", () => {
    const result = leaderboardSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Title validation
  it("should reject empty title", () => {
    const result = leaderboardSchema.safeParse({ ...validData, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("title"))).toBe(
        true,
      );
    }
  });

  it("should reject title shorter than 3 characters", () => {
    const result = leaderboardSchema.safeParse({ ...validData, title: "AB" });
    expect(result.success).toBe(false);
  });

  it("should reject title longer than 100 characters", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      title: "A".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  // Date validation
  it("should reject endDate before startDate", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      startDate: "2026-04-01T00:00",
      endDate: "2026-03-01T00:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("endDate"))).toBe(
        true,
      );
    }
  });

  it("should reject endDate equal to startDate", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      startDate: "2026-03-01T00:00",
      endDate: "2026-03-01T00:00",
    });
    expect(result.success).toBe(false);
  });

  // Prizes validation
  it("should reject empty prizes array", () => {
    const result = leaderboardSchema.safeParse({ ...validData, prizes: [] });
    expect(result.success).toBe(false);
  });

  it("should reject duplicate prize ranks", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      prizes: [
        {
          rank: 1,
          name: "Gold",
          type: "coins",
          amount: 1000,
          imageUrl: "https://example.com/a.png",
        },
        {
          rank: 1,
          name: "Silver",
          type: "coins",
          amount: 500,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-sequential prize ranks", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      prizes: [
        {
          rank: 1,
          name: "Gold",
          type: "coins",
          amount: 1000,
          imageUrl: "https://example.com/a.png",
        },
        {
          rank: 3,
          name: "Bronze",
          type: "coins",
          amount: 300,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should accept sequential ranks starting from 1", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      prizes: [
        {
          rank: 1,
          name: "Gold",
          type: "coins",
          amount: 1000,
          imageUrl: "https://example.com/a.png",
        },
        {
          rank: 2,
          name: "Silver",
          type: "coins",
          amount: 500,
          imageUrl: "https://example.com/b.png",
        },
        {
          rank: 3,
          name: "Bronze",
          type: "freeSpin",
          amount: 50,
          imageUrl: "https://example.com/c.png",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should reject prize with invalid imageUrl", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      prizes: [
        {
          rank: 1,
          name: "Gold",
          type: "coins",
          amount: 1000,
          imageUrl: "not-a-url",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  // Max participants
  it("should reject maxParticipants less than 2", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      maxParticipants: 1,
    });
    expect(result.success).toBe(false);
  });

  it("should reject maxParticipants as decimal", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      maxParticipants: 10.5,
    });
    expect(result.success).toBe(false);
  });

  // Status and scoring type
  it("should reject invalid status", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid scoringType", () => {
    const result = leaderboardSchema.safeParse({
      ...validData,
      scoringType: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should accept all valid scoring types", () => {
    for (const type of ["points", "wins", "wagered"] as const) {
      const result = leaderboardSchema.safeParse({
        ...validData,
        scoringType: type,
      });
      expect(result.success).toBe(true);
    }
  });
});
