import apiClient from "@/shared/api/axios";
import type { Admin, LoginResponse, LoginValues } from "../types";

export const authApi = {
  login: async (data: LoginValues): Promise<LoginResponse> => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  me: async (): Promise<Admin> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};
