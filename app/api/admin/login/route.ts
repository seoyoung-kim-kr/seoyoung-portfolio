import { cookies } from "next/headers";
import { apiError, apiOk, BadRequestError, readJsonBody } from "@/src/shared/lib/apiResponse";
import { createSessionCookie, verifyAdminPassword } from "@/src/features/admin/session";

/** body 형태를 신뢰할 수 없으므로, 객체이고 password 가 문자열인 경우에만 값을 꺼냅니다. */
function readPassword(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("password" in body)) return null;
  return typeof body.password === "string" ? body.password : null;
}

export async function POST(req: Request) {
  try {
    const password = readPassword(await readJsonBody(req));

    if (password === null || !verifyAdminPassword(password)) {
      return apiError("비밀번호가 올바르지 않습니다.", 401);
    }

    const { name, value, options } = createSessionCookie();
    (await cookies()).set(name, value, options);
    return apiOk({});
  } catch (error) {
    if (error instanceof BadRequestError) {
      return apiError(error.message, 400);
    }
    // ADMIN_PASSWORD 미설정 등 서버 설정 문제. 상세 원인은 서버 로그에만 남깁니다.
    console.error(error);
    return apiError("로그인 처리 중 서버 오류가 발생했습니다.", 500);
  }
}
