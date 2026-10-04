/**
 * Route Handler 와 클라이언트가 공유하는 API 응답 규약.
 * 성공 시 `{ success: true, ...data }`, 실패 시 `{ success: false, message }` 형태입니다.
 */
export type ApiSuccess<T extends object = object> = { success: true } & T;
export type ApiFailure = { success: false; message: string };
export type ApiResponse<T extends object = object> = ApiSuccess<T> | ApiFailure;

/** catch 절의 `unknown` 에러에서 사용자에게 보여줄 메시지를 꺼냅니다. */
export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/**
 * 클라이언트에서 내부 API 를 호출하고, 실패 응답이면 서버 메시지로 Error 를 던집니다.
 */
export async function requestApi<T extends object = object>(
  input: string,
  init?: RequestInit
): Promise<ApiSuccess<T>> {
  const res = await fetch(input, init);
  // 내부 API 는 항상 ApiResponse 형태로 응답하도록 작성되어 있으므로 단언합니다.
  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    throw new Error(json.success ? `요청에 실패했습니다. (${res.status})` : json.message);
  }
  return json;
}

/** JSON body 를 보내는 요청 옵션을 만듭니다. */
export function jsonBody(method: "POST" | "PUT" | "PATCH", body: unknown): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}
