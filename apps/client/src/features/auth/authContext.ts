import { createContext } from "react";
import type { LoginValues, Player } from "./types";

export interface AuthContextValue {
  user: Player | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (values: LoginValues) => Promise<void>;
  logout: () => void;
  /** Update the cached balance after a play without a round-trip. */
  setBalance: (balance: number) => void;
  /** Re-fetch the player from the server. */
  refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
