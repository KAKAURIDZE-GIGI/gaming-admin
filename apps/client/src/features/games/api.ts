import apiClient from "@/shared/api/axios";
import type { PlayRecord, Slot, Wheel } from "@/shared/types";

// ---- Read-only active game configs ----
export const gamesApi = {
  listWheels: async (): Promise<Wheel[]> =>
    (await apiClient.get("/games/wheels")).data.data,
  getWheel: async (id: string): Promise<Wheel> =>
    (await apiClient.get(`/games/wheels/${id}`)).data,
  listSlots: async (): Promise<Slot[]> =>
    (await apiClient.get("/games/slots")).data.data,
  getSlot: async (id: string): Promise<Slot> =>
    (await apiClient.get(`/games/slots/${id}`)).data,
};

// ---- Server-authoritative play actions ----
export interface WheelResult {
  segmentIndex: number;
  segment: { label: string; prizeType: string; prizeAmount: number };
  payout: number;
  amountWon: number;
  balance: number;
}
export interface SlotResult {
  grid: string[][]; // reel-major: grid[reel][row] = symbol key
  winningLines: number[];
  lines: number;
  payout: number;
  amountWon: number;
  balance: number;
}

export const playApi = {
  wheel: async (id: string, bet: number): Promise<WheelResult> =>
    (await apiClient.post(`/play/wheel/${id}`, { bet })).data,
  slot: async (id: string, bet: number, lines: number): Promise<SlotResult> =>
    (await apiClient.post(`/play/slot/${id}`, { bet, lines })).data,
  history: async (
    page: number,
    limit: number,
  ): Promise<{ data: PlayRecord[]; total: number }> =>
    (await apiClient.get("/play/history", { params: { page, limit } })).data,
};
