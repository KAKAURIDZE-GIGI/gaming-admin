export interface WheelSegment {
  id: string;
  label: string;
  color: string;
  weight: number;
  prizeType: "coins" | "freeSpin" | "bonus" | "nothing";
  prizeAmount: number;
  imageUrl: string;
}

export interface Wheel {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "inactive";
  segments: WheelSegment[];
  betSizes: number[];
  maxSpinsPerUser: number;
  spinCost: number;
  backgroundColor: string;
  borderColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface WheelFormValues {
  name: string;
  description: string;
  status: "draft" | "active" | "inactive";
  segments: Omit<WheelSegment, "id">[];
  betSizes: number[];
  maxSpinsPerUser: number;
  spinCost: number;
  backgroundColor: string;
  borderColor: string;
}
