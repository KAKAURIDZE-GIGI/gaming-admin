import { useCallback, useEffect, useState } from "react";
import { tokenStorage } from "@/shared/api/axios";
import { authApi } from "../api/authApi";
import type { Admin, LoginValues } from "../types";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  // Start loading only if a token exists and must be validated.
  const [isLoading, setIsLoading] = useState<boolean>(
    () => !!tokenStorage.get(),
  );

  // On mount, validate any stored token by fetching the current admin.
  useEffect(() => {
    if (!tokenStorage.get()) return;
    let active = true;
    authApi
      .me()
      .then((data) => {
        if (active) setAdmin(data);
      })
      .catch(() => {
        tokenStorage.clear();
        if (active) setAdmin(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (values: LoginValues) => {
    const { token, admin } = await authApi.login(values);
    tokenStorage.set(token);
    setAdmin(admin);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setAdmin(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
