import apiClient from "@/shared/api/axios";
import type { Wheel, WheelFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

interface ListResponse {
  data: Wheel[];
  total: number;
}

export const wheelApi = {
  getAll: async (params: ListParams): Promise<ListResponse> => {
    const response = await apiClient.get("/wheels", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Wheel> => {
    const response = await apiClient.get(`/wheels/${id}`);
    return response.data;
  },

  create: async (data: WheelFormValues): Promise<Wheel> => {
    const response = await apiClient.post("/wheels", data);
    return response.data;
  },

  update: async (id: string, data: WheelFormValues): Promise<Wheel> => {
    const response = await apiClient.put(`/wheels/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/wheels/${id}`);
  },
};
