"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { jsonBody, requestApi } from "@/src/shared/lib/http";

/** 세션 확인 전("checking")과 비관리자("guest")를 구분해야 깜빡임/오리다이렉트가 생기지 않습니다. */
export type AdminStatus = "checking" | "admin" | "guest";

type AdminContextValue = {
  status: AdminStatus;
  isAdmin: boolean;
  /** 실패 시 서버 메시지를 담은 Error 를 던집니다. */
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AdminStatus>("checking");

  useEffect(() => {
    requestApi<{ isAdmin: boolean }>("/api/admin/check")
      .then(({ isAdmin }) => setStatus(isAdmin ? "admin" : "guest"))
      .catch(() => setStatus("guest"));
  }, []);

  const login = async (password: string) => {
    await requestApi("/api/admin/login", jsonBody("POST", { password }));
    setStatus("admin");
  };

  const logout = async () => {
    await requestApi("/api/admin/logout", { method: "POST" });
    setStatus("guest");
  };

  return (
    <AdminContext.Provider value={{ status, isAdmin: status === "admin", login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin 은 AdminProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
}
