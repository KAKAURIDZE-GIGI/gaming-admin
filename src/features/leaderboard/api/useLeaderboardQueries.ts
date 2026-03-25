import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS } from "@/shared/lib";
import { leaderboardApi } from "./leaderboardApi";
import type { LeaderboardFormValues } from "../types";

interface ListParams {
  page: number;
  limit: number;
  sortBy?: string;
  order?: "asc" | "desc";
  status?: string;
}

export function useLeaderboardList(params: ListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERBOARD.LIST(params),
    queryFn: () => leaderboardApi.getAll(params),
  });
}

export function useLeaderboardDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.LEADERBOARD.DETAIL(id),
    queryFn: () => leaderboardApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateLeaderboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeaderboardFormValues) => leaderboardApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERBOARD.ALL });
      toast.success("Leaderboard created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create leaderboard");
    },
  });
}

export function useUpdateLeaderboard(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeaderboardFormValues) =>
      leaderboardApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERBOARD.ALL });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.LEADERBOARD.DETAIL(id),
      });
      toast.success("Leaderboard updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update leaderboard");
    },
  });
}

export function useDeleteLeaderboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leaderboardApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LEADERBOARD.ALL });
      toast.success("Leaderboard deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete leaderboard");
    },
  });
}
