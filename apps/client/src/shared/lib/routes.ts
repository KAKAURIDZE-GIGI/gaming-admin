export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY: "/verify",
  WHEELS: "/wheels",
  WHEEL_PLAY: (id: string) => `/wheels/${id}`,
  RAFFLES: "/raffles",
  RAFFLE_PLAY: (id: string) => `/raffles/${id}`,
  LEADERBOARDS: "/leaderboards",
  LEADERBOARD_PLAY: (id: string) => `/leaderboards/${id}`,
  HISTORY: "/history",
} as const;
