export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  LEADERBOARD: {
    LIST: "/leaderboards",
    CREATE: "/leaderboards/create",
    EDIT: (id: string) => `/leaderboards/${id}/edit`,
    DETAIL: (id: string) => `/leaderboards/${id}`,
  },
  RAFFLE: {
    LIST: "/raffles",
    CREATE: "/raffles/create",
    EDIT: (id: string) => `/raffles/${id}/edit`,
    DETAIL: (id: string) => `/raffles/${id}`,
  },
  WHEEL: {
    LIST: "/wheels",
    CREATE: "/wheels/create",
    EDIT: (id: string) => `/wheels/${id}/edit`,
    DETAIL: (id: string) => `/wheels/${id}`,
  },
  SLOT: {
    LIST: "/slots",
    CREATE: "/slots/create",
    EDIT: (id: string) => `/slots/${id}/edit`,
    DETAIL: (id: string) => `/slots/${id}`,
  },
} as const;
