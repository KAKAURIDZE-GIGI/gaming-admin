import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/shared/lib";
import { wheelApi } from "./wheelApi";
import type { WheelFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

export function useWheelList(params: ListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.WHEEL.LIST(params),
    queryFn: () => wheelApi.getAll(params),
  });
}

export function useWheelDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.WHEEL.DETAIL(id),
    queryFn: () => wheelApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateWheel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WheelFormValues) => wheelApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WHEEL.ALL });
      toast.success("Wheel created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create wheel");
    },
  });
}

export function useUpdateWheel(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WheelFormValues) => wheelApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WHEEL.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WHEEL.DETAIL(id) });
      toast.success("Wheel updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update wheel");
    },
  });
}

export function useDeleteWheel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wheelApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WHEEL.ALL });
      toast.success("Wheel deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete wheel");
    },
  });
}
