import apiClient from "@/shared/api/axios";
import type { LoginValues, Player, RegisterValues } from "./types";

export const authApi = {
  register: async (data: RegisterValues): Promise<{ message: string }> => {
    const res = await apiClient.post("/user-auth/register", data);
    return res.data;
  },
  verify: async (token: string): Promise<{ message: string }> => {
    const res = await apiClient.post("/user-auth/verify", { token });
    return res.data;
  },
  login: async (
    data: LoginValues,
  ): Promise<{ token: string; user: Player }> => {
    const res = await apiClient.post("/user-auth/login", data);
    return res.data;
  },
  me: async (): Promise<Player> => {
    const res = await apiClient.get("/user-auth/me");
    return res.data;
  },
};
