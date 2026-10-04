import { NextResponse } from "next/server";
import type { ApiFailure, ApiSuccess } from "./http";

/** Route Handler 전용 응답 헬퍼 (서버 전용). */
export function apiOk<T extends object>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, ...data }, init);
}

export function apiError(message: string, status: number) {
  return NextResponse.json<ApiFailure>({ success: false, message }, { status });
}

/** 요청 형식 자체가 잘못된 경우 던지는 에러. Route Handler 에서 400 으로 변환합니다. */
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

/** 요청 body 를 JSON 으로 읽습니다. 파싱에 실패하면 BadRequestError 를 던집니다. */
export async function readJsonBody(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new BadRequestError("요청 본문이 올바른 JSON 형식이 아닙니다.");
  }
}

/** 요청 body 를 multipart/form-data 로 읽습니다. 파싱에 실패하면 BadRequestError 를 던집니다. */
export async function readFormData(req: Request): Promise<FormData> {
  try {
    return await req.formData();
  } catch {
    throw new BadRequestError("요청 본문이 올바른 form-data 형식이 아닙니다.");
  }
}
