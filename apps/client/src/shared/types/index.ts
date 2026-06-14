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

export interface Slot {
  id: string;
  name: string;
  description: string;
  winRate: number;
  betSizes: number[];
}

export interface PlayRecord {
  id: string;
  gameType: "wheel" | "slot";
  gameName: string;
  bet: number;
  outcome: string;
  amountWon: number;
  balanceAfter: number;
  createdAt: string;
}
