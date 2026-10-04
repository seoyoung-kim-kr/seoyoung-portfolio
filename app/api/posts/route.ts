import { revalidatePath } from "next/cache";
import { apiOk } from "@/src/shared/lib/apiResponse";
import { adminRoute } from "@/src/features/admin/adminRoute";
import { createProject, updateProjectOrders } from "@/src/features/projects/mutations";
import {
  parseBody,
  projectInputSchema,
  projectOrderSchema,
} from "@/src/features/projects/projectInput";

/** 프로젝트 생성 */
export const POST = adminRoute(async (req: Request) => {
  const input = await parseBody(projectInputSchema, await req.json());
  const created = await createProject(input);

  revalidatePath("/", "layout");
  return apiOk(created, { status: 201 });
});

/** 프로젝트 정렬 순서 일괄 저장 */
export const PATCH = adminRoute(async (req: Request) => {
  const input = await parseBody(projectOrderSchema, await req.json());
  await updateProjectOrders(input);

  revalidatePath("/", "layout");
  return apiOk({});
});
