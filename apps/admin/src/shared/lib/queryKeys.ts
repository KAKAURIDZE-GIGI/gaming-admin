export const QUERY_KEYS = {
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
