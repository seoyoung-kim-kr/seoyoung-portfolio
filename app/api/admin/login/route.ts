import { cookies } from "next/headers";
import { apiError, apiOk } from "@/src/shared/lib/apiResponse";
import { createSessionCookie, verifyAdminPassword } from "@/src/features/admin/session";

export async function POST(req: Request) {
  // body 형태를 신뢰할 수 없으므로 unknown 으로 받고 아래에서 문자열인지 직접 검사합니다.
  const { password } = (await req.json().catch(() => ({}))) as { password?: unknown };

  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return apiError("비밀번호가 올바르지 않습니다.", 401);
  }

  const { name, value, options } = createSessionCookie();
  (await cookies()).set(name, value, options);
  return apiOk({});
}
