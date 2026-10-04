"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiShield, FiPlus, FiArrowRight, FiLogOut, FiLayers, FiCheckCircle } from "react-icons/fi";
import Container from "@/src/shared/ui/Container";
import { getErrorMessage } from "@/src/shared/lib/http";
import { useAdmin } from "@/src/features/admin/AdminContext";

const CARD_CLASS =
  "p-8 sm:p-10 rounded-3xl bg-white/90 dark:bg-brand-dark-card/90 border border-brand-muted/40 dark:border-brand-muted/20 shadow-2xl backdrop-blur-xl animate-fade-in";

function LoginCard() {
  const { login } = useAdmin();
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await login(password);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "로그인에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${CARD_CLASS} space-y-6`}>
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-full bg-brand-muted/30 flex items-center justify-center text-brand-accent dark:text-brand-muted mb-4">
          <FiShield className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark dark:text-brand-light">
          Seoyoung Admin Portal
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          포트폴리오 관리자 전용 시크릿 게이트웨이입니다.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="block text-xs font-bold mb-1.5 text-brand-dark dark:text-brand-light">
            관리자 비밀번호
          </span>
          <input
            type="password"
            required
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-brand-dark-base text-sm focus:outline-none focus:border-brand-muted"
            autoFocus
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-2xl bg-brand-muted hover:bg-brand-muted-hover text-brand-dark font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중..." : "관리자 모드 잠금 해제"}
        </button>
      </form>
    </div>
  );
}

function DashboardCard() {
  const { logout } = useAdmin();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className={`${CARD_CLASS} space-y-8`}>
      <div className="flex items-center justify-between border-b border-brand-muted/30 pb-6">
        <div className="flex items-center gap-3">
          <FiCheckCircle className="w-6 h-6 text-brand-muted-alt" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-dark dark:text-brand-light">
              Admin Active
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">관리자 권한이 활성화되었습니다.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 text-xs font-bold hover:bg-red-200 transition-colors"
        >
          <FiLogOut className="w-3.5 h-3.5" />
          <span>로그아웃</span>
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-extrabold text-brand-accent dark:text-brand-muted uppercase tracking-wider">
          Quick Admin Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/sy-admin/write"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-brand-muted/30 hover:bg-brand-muted/50 text-brand-dark dark:text-brand-light font-bold text-sm border border-brand-muted/60 transition-all active:scale-95 shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span>새 프로젝트 작성</span>
          </Link>

          <Link
            href="/sy-admin/order"
            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-brand-dark-base hover:bg-gray-50 dark:hover:bg-gray-800 text-brand-dark dark:text-brand-light font-bold text-sm border border-gray-200 dark:border-gray-700 transition-all active:scale-95 shadow-sm"
          >
            <FiLayers className="w-4 h-4 text-brand-muted" />
            <span>프로젝트 정렬 관리</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-brand-dark-base border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="font-bold text-brand-dark dark:text-brand-light">💡 안내</p>
        <p>
          이제 사이트 어디서든(Home, Projects, 상세페이지) 프로젝트 작성, 수정(연필), 삭제(휴지통) 버튼이
          나타납니다.
        </p>
      </div>
    </div>
  );
}

export default function AdminHomePage() {
  const { status } = useAdmin();

  return (
    <Container className="py-16 sm:py-24 max-w-xl mx-auto">
      {status === "checking" && (
        <p className="text-center text-sm text-gray-400">관리자 권한을 확인하고 있습니다...</p>
      )}
      {status === "guest" && <LoginCard />}
      {status === "admin" && <DashboardCard />}
    </Container>
  );
}
