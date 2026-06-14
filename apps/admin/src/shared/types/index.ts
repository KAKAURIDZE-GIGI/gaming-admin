export type PrizeType = "coins" | "freeSpin" | "bonus";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SortParams {
  sortBy: string;
  order: "asc" | "desc";
}

export interface ApiListParams extends PaginationParams, Partial<SortParams> {
  status?: string;
  [key: string]: unknown;
}
