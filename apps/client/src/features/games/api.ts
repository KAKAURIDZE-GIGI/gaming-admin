import apiClient from "@/shared/api/axios";
import type {
  Leaderboard,
  PlayRecord,
  Raffle,
  Wheel,
} from "@/shared/types";

// ---- Read-only active game configs ----
export const gamesApi = {
  listWheels: async (): Promise<Wheel[]> =>
    (await apiClient.get("/games/wheels")).data.data,
  getWheel: async (id: string): Promise<Wheel> =>
    (await apiClient.get(`/games/wheels/${id}`)).data,
  listRaffles: async (): Promise<Raffle[]> =>
    (await apiClient.get("/games/raffles")).data.data,
  getRaffle: async (id: string): Promise<Raffle> =>
    (await apiClient.get(`/games/raffles/${id}`)).data,
  listLeaderboards: async (): Promise<Leaderboard[]> =>
    (await apiClient.get("/games/leaderboards")).data.data,
  getLeaderboard: async (id: string): Promise<Leaderboard> =>
    (await apiClient.get(`/games/leaderboards/${id}`)).data,
};

// ---- Server-authoritative play actions ----
export interface WheelResult {
  segmentIndex: number;
  segment: { label: string; prizeType: string; prizeAmount: number };
  payout: number;
  amountWon: number;
  balance: number;
}
export interface RaffleResult {
  tickets: number;
  totalTickets: number;
  cost: number;
  balance: number;
}
export interface LeaderboardResult {
  points: number;
  totalScore: number;
  rank: number;
  cashWon: number;
  amountWon: number;
  balance: number;
}
export interface Standing {
  id: string;
  name: string;
  score: number;
}
export interface StandingsResponse {
  standings: Standing[];
  myRank: number | null;
  myScore: number;
}

export const playApi = {
  wheel: async (id: string, bet: number): Promise<WheelResult> =>
    (await apiClient.post(`/play/wheel/${id}`, { bet })).data,
  raffle: async (
    id: string,
    bet: number,
    quantity: number,
  ): Promise<RaffleResult> =>
    (await apiClient.post(`/play/raffle/${id}`, { bet, quantity })).data,
  leaderboard: async (id: string, bet: number): Promise<LeaderboardResult> =>
    (await apiClient.post(`/play/leaderboard/${id}`, { bet })).data,
  standings: async (id: string): Promise<StandingsResponse> =>
    (await apiClient.get(`/play/leaderboard/${id}/standings`)).data,
  history: async (
    page: number,
    limit: number,
  ): Promise<{ data: PlayRecord[]; total: number }> =>
    (await apiClient.get("/play/history", { params: { page, limit } })).data,
};
