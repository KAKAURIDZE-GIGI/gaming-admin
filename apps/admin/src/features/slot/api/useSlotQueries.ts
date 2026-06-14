import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/shared/lib";
import { slotApi } from "./slotApi";
import type { SlotFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

export function useSlotList(params: ListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.SLOT.LIST(params),
    queryFn: () => slotApi.getAll(params),
  });
}

export function useSlotDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SLOT.DETAIL(id),
    queryFn: () => slotApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SlotFormValues) => slotApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SLOT.ALL });
      toast.success("Slot created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create slot");
    },
  });
}

export function useUpdateSlot(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SlotFormValues) => slotApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SLOT.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SLOT.DETAIL(id) });
      toast.success("Slot updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update slot");
    },
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => slotApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SLOT.ALL });
      toast.success("Slot deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete slot");
    },
  });
}
