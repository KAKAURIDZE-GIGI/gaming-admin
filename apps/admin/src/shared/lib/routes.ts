export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
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
