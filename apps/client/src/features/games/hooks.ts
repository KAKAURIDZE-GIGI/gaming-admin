import { useQuery } from "@tanstack/react-query";
import { gamesApi } from "./api";

export const useWheels = () =>
  useQuery({ queryKey: ["wheels"], queryFn: gamesApi.listWheels });

export const useWheel = (id: string) =>
  useQuery({
    queryKey: ["wheel", id],
    queryFn: () => gamesApi.getWheel(id),
    enabled: !!id,
  });

export const useRaffles = () =>
  useQuery({ queryKey: ["raffles"], queryFn: gamesApi.listRaffles });

export const useRaffle = (id: string) =>
  useQuery({
    queryKey: ["raffle", id],
    queryFn: () => gamesApi.getRaffle(id),
    enabled: !!id,
  });

export const useLeaderboards = () =>
  useQuery({
    queryKey: ["leaderboards"],
    queryFn: gamesApi.listLeaderboards,
  });

export const useLeaderboard = (id: string) =>
  useQuery({
    queryKey: ["leaderboard", id],
    queryFn: () => gamesApi.getLeaderboard(id),
    enabled: !!id,
  });
