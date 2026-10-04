"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "./AdminContext";

/**
 * 관리자 전용 화면을 감싸는 클라이언트 가드.
 * UX 용도의 가드이며, 실제 권한 검사는 API(adminRoute)에서 수행합니다.
 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const { status } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") router.replace("/sy-admin");
  }, [status, router]);

  if (status !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-400">관리자 권한을 확인하고 있습니다...</p>
      </div>
    );
  }

  return children;
}
