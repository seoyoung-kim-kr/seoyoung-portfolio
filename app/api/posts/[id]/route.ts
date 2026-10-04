import { revalidatePath } from "next/cache";
import { apiOk } from "@/src/shared/lib/apiResponse";
import { adminRoute } from "@/src/features/admin/adminRoute";
import { deleteProject, updateProject } from "@/src/features/projects/mutations";
import { parseBody, projectPatchSchema } from "@/src/features/projects/projectInput";

type Context = { params: Promise<{ id: string }> };

/** 프로젝트 수정 (id 또는 slug) */
export const PUT = adminRoute(async (req: Request, { params }: Context) => {
  const { id } = await params;
  const patch = await parseBody(projectPatchSchema, await req.json());
  await updateProject(id, patch);

  revalidatePath("/", "layout");
  return apiOk({});
});

/** 프로젝트 삭제 (id 또는 slug) */
export const DELETE = adminRoute(async (_req: Request, { params }: Context) => {
  const { id } = await params;
  await deleteProject(id);

  revalidatePath("/", "layout");
  return apiOk({});
});
