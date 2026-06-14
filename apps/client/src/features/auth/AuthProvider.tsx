import { useCallback, useEffect, useState } from "react";
import { tokenStorage } from "@/shared/api/axios";
import { authApi } from "./authApi";
import type { LoginValues, Player } from "./types";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => !!tokenStorage.get());

  useEffect(() => {
    if (!tokenStorage.get()) return;
    let active = true;
    authApi
      .me()
      .then((u) => active && setUser(u))
      .catch(() => {
        tokenStorage.clear();
        if (active) setUser(null);
      })
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (values: LoginValues) => {
    const { token, user } = await authApi.login(values);
    tokenStorage.set(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const setBalance = useCallback((balance: number) => {
    setUser((prev) => (prev ? { ...prev, balance } : prev));
  }, []);

  const refresh = useCallback(async () => {
    try {
      setUser(await authApi.me());
    } catch {
      /* ignore — interceptor handles 401 */
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setBalance,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
