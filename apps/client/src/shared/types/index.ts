export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  weight: number;
  prizeType: "coins" | "freeSpin" | "bonus" | "nothing";
  prizeAmount: number;
  imageUrl?: string;
}

export interface Wheel {
  id: string;
  name: string;
  description: string;
  segments: WheelSegment[];
  betSizes: number[];
  maxSpinsPerUser: number;
  spinCost: number;
  backgroundColor: string;
  borderColor: string;
}

export interface RafflePrize {
  id: string;
  name: string;
  type: string;
  amount: number;
  quantity: number;
  imageUrl?: string;
}

export interface Raffle {
  id: string;
  name: string;
  description: string;
  endDate: string;
  drawDate: string;
  ticketPrice: number;
  betSizes: number[];
  maxTicketsPerUser: number;
  prizes: RafflePrize[];
  totalTicketLimit: number | null;
}

export interface LeaderboardPrize {
  id: string;
  rank: number;
  name: string;
  type: string;
  amount: number;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  endDate: string;
  scoringType: string;
  betSizes: number[];
  prizes: LeaderboardPrize[];
}

export interface PlayRecord {
  id: string;
  gameType: "wheel" | "raffle" | "leaderboard";
  gameName: string;
  bet: number;
  outcome: string;
  amountWon: number;
  balanceAfter: number;
  createdAt: string;
}
