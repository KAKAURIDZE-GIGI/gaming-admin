import apiClient from "@/shared/api/axios";
import type { Leaderboard, LeaderboardFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

interface ListResponse {
  data: Leaderboard[];
  total: number;
}

export const leaderboardApi = {
  getAll: async (params: ListParams): Promise<ListResponse> => {
    const response = await apiClient.get("/leaderboards", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Leaderboard> => {
    const response = await apiClient.get(`/leaderboards/${id}`);
    return response.data;
  },

  create: async (data: LeaderboardFormValues): Promise<Leaderboard> => {
    const response = await apiClient.post("/leaderboards", data);
    return response.data;
  },

  update: async (
    id: string,
    data: LeaderboardFormValues,
  ): Promise<Leaderboard> => {
    const response = await apiClient.put(`/leaderboards/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/leaderboards/${id}`);
  },
};
