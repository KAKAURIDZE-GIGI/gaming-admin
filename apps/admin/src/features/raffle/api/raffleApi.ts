import apiClient from "@/shared/api/axios";
import type { Raffle, RaffleFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

interface ListResponse {
  data: Raffle[];
  total: number;
}

export const raffleApi = {
  getAll: async (params: ListParams): Promise<ListResponse> => {
    const response = await apiClient.get("/raffles", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Raffle> => {
    const response = await apiClient.get(`/raffles/${id}`);
    return response.data;
  },

  create: async (data: RaffleFormValues): Promise<Raffle> => {
    const response = await apiClient.post("/raffles", data);
    return response.data;
  },

  update: async (id: string, data: RaffleFormValues): Promise<Raffle> => {
    const response = await apiClient.put(`/raffles/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/raffles/${id}`);
  },
};
