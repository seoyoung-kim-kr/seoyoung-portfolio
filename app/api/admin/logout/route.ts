import { cookies } from "next/headers";
import { apiOk } from "@/src/shared/lib/apiResponse";
import { ADMIN_SESSION_COOKIE } from "@/src/features/admin/session";

export async function POST() {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
  return apiOk({});
}
