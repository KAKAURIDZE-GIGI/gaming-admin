export const QUERY_KEYS = {
  LEADERBOARD: {
    ALL: ["leaderboards"] as const,
    LIST: (params: unknown) => ["leaderboards", "list", params] as const,
    DETAIL: (id: string) => ["leaderboards", "detail", id] as const,
  },
  RAFFLE: {
    ALL: ["raffles"] as const,
    LIST: (params: unknown) => ["raffles", "list", params] as const,
    DETAIL: (id: string) => ["raffles", "detail", id] as const,
  },
  WHEEL: {
    ALL: ["wheels"] as const,
    LIST: (params: unknown) => ["wheels", "list", params] as const,
    DETAIL: (id: string) => ["wheels", "detail", id] as const,
  },
  SLOT: {
    ALL: ["slots"] as const,
    LIST: (params: unknown) => ["slots", "list", params] as const,
    DETAIL: (id: string) => ["slots", "detail", id] as const,
  },
} as const;
