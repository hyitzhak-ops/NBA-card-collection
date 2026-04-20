"use client";

import { useCallback, useEffect, useState } from "react";

type AdminSessionState =
  | { status: "loading" }
  | { status: "authenticated"; username: string }
  | { status: "anonymous" };

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>({ status: "loading" });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session", { credentials: "include" });
      const data = (await res.json()) as { ok?: boolean; username?: string };
      if (data.ok && typeof data.username === "string") {
        setState({ status: "authenticated", username: data.username });
      } else {
        setState({ status: "anonymous" });
      }
    } catch {
      setState({ status: "anonymous" });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      await refresh();
      return true;
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setState({ status: "anonymous" });
    }
  }, []);

  const isLoading = state.status === "loading";
  const isAuthenticated = state.status === "authenticated";
  const username =
    state.status === "authenticated" ? state.username : undefined;

  return {
    isLoading,
    isAuthenticated,
    username,
    login,
    logout,
    refresh,
  };
}
