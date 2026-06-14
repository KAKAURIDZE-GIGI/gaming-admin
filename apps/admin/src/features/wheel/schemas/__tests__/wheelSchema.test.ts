import { describe, it, expect } from "vitest";
import { wheelSchema } from "../index";

const validData = {
  name: "Daily Wheel",
  description: "Spin daily for rewards",
  status: "draft" as const,
  segments: [
    {
      label: "Prize 1",
      color: "#EF4444",
      weight: 60,
      prizeType: "coins" as const,
      prizeAmount: 100,
      imageUrl: "https://example.com/a.png",
    },
    {
      label: "Nothing",
      color: "#6B7280",
      weight: 40,
      prizeType: "nothing" as const,
      prizeAmount: 0,
      imageUrl: "https://example.com/b.png",
    },
  ],
  maxSpinsPerUser: 1,
  spinCost: 0,
  backgroundColor: "#1F2937",
  borderColor: "#F59E0B",
};

describe("wheelSchema", () => {
  it("should accept valid data", () => {
    const result = wheelSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  // Name validation
  it("should reject empty name", () => {
    const result = wheelSchema.safeParse({ ...validData, name: "" });
    expect(result.success).toBe(false);
  });

  it("should reject name shorter than 3 characters", () => {
    const result = wheelSchema.safeParse({ ...validData, name: "AB" });
    expect(result.success).toBe(false);
  });

  it("should reject name longer than 80 characters", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      name: "A".repeat(81),
    });
    expect(result.success).toBe(false);
  });

  // Segment count
  it("should reject fewer than 2 segments", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "Only One",
          color: "#EF4444",
          weight: 100,
          prizeType: "coins",
          prizeAmount: 100,
          imageUrl: "https://example.com/a.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should reject more than 12 segments", () => {
    const segments = Array.from({ length: 13 }, (_, i) => ({
      label: `Seg ${i + 1}`,
      color: "#EF4444",
      weight: Math.floor(100 / 13),
      prizeType: "coins" as const,
      prizeAmount: 100,
      imageUrl: "https://example.com/a.png",
    }));
    // Adjust weight to sum to 100
    segments[0].weight += 100 - segments.reduce((s, seg) => s + seg.weight, 0);
    const result = wheelSchema.safeParse({ ...validData, segments });
    expect(result.success).toBe(false);
  });

  it("should accept exactly 12 segments with weights summing to 100", () => {
    const segments = Array.from({ length: 12 }, (_, i) => ({
      label: `Seg ${i + 1}`,
      color: "#EF4444",
      weight: i < 8 ? 8 : 9,
      prizeType: "coins" as const,
      prizeAmount: 100,
      imageUrl: "https://example.com/a.png",
    }));
    // Fix: 8*8 + 4*9 = 64 + 36 = 100
    const result = wheelSchema.safeParse({ ...validData, segments });
    expect(result.success).toBe(true);
  });

  // Weight validation
  it("should reject weights not summing to 100", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "A",
          color: "#EF4444",
          weight: 30,
          prizeType: "coins",
          prizeAmount: 100,
          imageUrl: "https://example.com/a.png",
        },
        {
          label: "B",
          color: "#3B82F6",
          weight: 30,
          prizeType: "coins",
          prizeAmount: 200,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) =>
          i.message.includes("sum to exactly 100"),
        ),
      ).toBe(true);
    }
  });

  it("should reject weight of 0", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "A",
          color: "#EF4444",
          weight: 100,
          prizeType: "coins",
          prizeAmount: 100,
          imageUrl: "https://example.com/a.png",
        },
        {
          label: "B",
          color: "#3B82F6",
          weight: 0,
          prizeType: "coins",
          prizeAmount: 200,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  // Prize type / amount validation
  it("should reject prizeAmount > 0 when prizeType is nothing", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "A",
          color: "#EF4444",
          weight: 50,
          prizeType: "coins",
          prizeAmount: 100,
          imageUrl: "https://example.com/a.png",
        },
        {
          label: "B",
          color: "#6B7280",
          weight: 50,
          prizeType: "nothing",
          prizeAmount: 50,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should reject prizeAmount of 0 when prizeType is coins", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "A",
          color: "#EF4444",
          weight: 50,
          prizeType: "coins",
          prizeAmount: 0,
          imageUrl: "https://example.com/a.png",
        },
        {
          label: "B",
          color: "#6B7280",
          weight: 50,
          prizeType: "nothing",
          prizeAmount: 0,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should accept prizeAmount of 0 only for nothing type", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "Win",
          color: "#EF4444",
          weight: 50,
          prizeType: "bonus",
          prizeAmount: 5,
          imageUrl: "https://example.com/a.png",
        },
        {
          label: "Lose",
          color: "#6B7280",
          weight: 50,
          prizeType: "nothing",
          prizeAmount: 0,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  // Color validation
  it("should reject invalid hex color for segment", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      segments: [
        {
          label: "A",
          color: "red",
          weight: 50,
          prizeType: "coins",
          prizeAmount: 100,
          imageUrl: "https://example.com/a.png",
        },
        {
          label: "B",
          color: "#6B7280",
          weight: 50,
          prizeType: "nothing",
          prizeAmount: 0,
          imageUrl: "https://example.com/b.png",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid hex color for backgroundColor", () => {
    const result = wheelSchema.safeParse({
      ...validData,
      backgroundColor: "not-hex",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid hex color for borderColor", () => {
    const result = wheelSchema.safeParse({ ...validData, borderColor: "#GGG" });
    expect(result.success).toBe(false);
  });

  it("should reject maxSpinsPerUser less than 1", () => {
    const result = wheelSchema.safeParse({ ...validData, maxSpinsPerUser: 0 });
    expect(result.success).toBe(false);
  });

  it("should reject negative spinCost", () => {
    const result = wheelSchema.safeParse({ ...validData, spinCost: -1 });
    expect(result.success).toBe(false);
  });

  it("should accept spinCost of 0 (free)", () => {
    const result = wheelSchema.safeParse({ ...validData, spinCost: 0 });
    expect(result.success).toBe(true);
  });

  // Status
  it("should accept all valid statuses", () => {
    for (const status of ["draft", "active", "inactive"] as const) {
      const result = wheelSchema.safeParse({ ...validData, status });
      expect(result.success).toBe(true);
    }
  });

  it("should reject invalid status", () => {
    const result = wheelSchema.safeParse({ ...validData, status: "archived" });
    expect(result.success).toBe(false);
  });
});
