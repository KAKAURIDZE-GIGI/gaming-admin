import apiClient from "@/shared/api/axios";
import type { Slot, SlotFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

interface ListResponse {
  data: Slot[];
  total: number;
}

export const slotApi = {
  getAll: async (params: ListParams): Promise<ListResponse> => {
    const response = await apiClient.get("/slots", { params });
    return response.data;
  },
  getById: async (id: string): Promise<Slot> => {
    const response = await apiClient.get(`/slots/${id}`);
    return response.data;
  },
  create: async (data: SlotFormValues): Promise<Slot> => {
    const response = await apiClient.post("/slots", data);
    return response.data;
  },
  update: async (id: string, data: SlotFormValues): Promise<Slot> => {
    const response = await apiClient.put(`/slots/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/slots/${id}`);
  },
};
