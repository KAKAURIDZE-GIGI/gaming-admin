export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY: "/verify",
  WHEELS: "/wheels",
  WHEEL_PLAY: (id: string) => `/wheels/${id}`,
  SLOTS: "/slots",
  SLOT_PLAY: (id: string) => `/slots/${id}`,
  HISTORY: "/history",
} as const;
