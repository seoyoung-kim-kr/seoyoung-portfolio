import { apiOk } from "@/src/shared/lib/apiResponse";
import { isAdminSession } from "@/src/features/admin/session";

export async function GET() {
  return apiOk({ isAdmin: await isAdminSession() });
}
