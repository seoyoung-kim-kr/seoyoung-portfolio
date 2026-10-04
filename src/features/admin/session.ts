import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * 관리자 세션 (서버 전용).
 *
 * 쿠키 값은 ADMIN_PASSWORD 를 키로 한 HMAC 서명이므로, 비밀번호를 모르면 위조할 수 없습니다.
 * 비밀번호를 바꾸면 기존 세션은 자동으로 무효화됩니다.
 */

export const ADMIN_SESSION_COOKIE = "seoyoung_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7일

function getAdminPassword(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD 환경변수가 설정되어 있지 않습니다.");
  }
  return password;
}

function sign(value: string): string {
  return createHmac("sha256", getAdminPassword()).update(value).digest("hex");
}

/** 길이가 달라도 예외 없이, 타이밍 공격에 안전하게 문자열을 비교합니다. */
function safeEqual(a: string, b: string): boolean {
  const hashA = createHmac("sha256", "compare").update(a).digest();
  const hashB = createHmac("sha256", "compare").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function verifyAdminPassword(password: string): boolean {
  return safeEqual(password, getAdminPassword());
}

export function createSessionCookie() {
  return {
    name: ADMIN_SESSION_COOKIE,
    value: sign("admin-session"),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    },
  };
}

export async function isAdminSession(): Promise<boolean> {
  const session = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!session || !process.env.ADMIN_PASSWORD) return false;
  return safeEqual(session, sign("admin-session"));
}
