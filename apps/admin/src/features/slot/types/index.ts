export interface Slot {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active";
  winRate: number;
  betSizes: number[];
  createdAt: string;
  updatedAt: string;
}

export interface SlotFormValues {
  name: string;
  description: string;
  status: "draft" | "active";
  winRate: number;
  betSizes: number[];
}
