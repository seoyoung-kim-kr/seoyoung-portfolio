import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess } from "./http";

/** Route Handler 전용 응답 헬퍼 (서버 전용). */
export function apiOk<T extends object>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, ...data }, init);
}

export function apiError(message: string, status: number) {
  return NextResponse.json<ApiFailure>({ success: false, message }, { status });
}
