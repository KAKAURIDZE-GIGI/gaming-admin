import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/shared/lib";
import { raffleApi } from "./raffleApi";
import type { RaffleFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

export function useRaffleList(params: ListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.RAFFLE.LIST(params),
    queryFn: () => raffleApi.getAll(params),
  });
}

export function useRaffleDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RAFFLE.DETAIL(id),
    queryFn: () => raffleApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRaffle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RaffleFormValues) => raffleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RAFFLE.ALL });
      toast.success("Raffle created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create raffle");
    },
  });
}

export function useUpdateRaffle(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RaffleFormValues) => raffleApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RAFFLE.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RAFFLE.DETAIL(id) });
      toast.success("Raffle updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update raffle");
    },
  });
}

export function useDeleteRaffle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => raffleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RAFFLE.ALL });
      toast.success("Raffle deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete raffle");
    },
  });
}
