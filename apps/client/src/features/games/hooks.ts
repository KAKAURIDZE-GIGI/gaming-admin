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

export const useSlots = () =>
  useQuery({ queryKey: ["slots"], queryFn: gamesApi.listSlots });

export const useSlot = (id: string) =>
  useQuery({
    queryKey: ["slot", id],
    queryFn: () => gamesApi.getSlot(id),
    enabled: !!id,
  });
