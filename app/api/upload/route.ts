import { apiError, apiOk, readFormData } from "@/src/shared/lib/apiResponse";
import { sanityUploadImage } from "@/src/shared/lib/sanity";
import { adminRoute } from "@/src/features/admin/adminRoute";

export const POST = adminRoute(async (req: Request) => {
  const file = (await readFormData(req)).get("file");

  if (!(file instanceof File)) {
    return apiError("업로드할 파일이 없습니다.", 400);
  }
  if (!file.type.startsWith("image/")) {
    return apiError("이미지 파일만 업로드할 수 있습니다.", 400);
  }

  return apiOk(await sanityUploadImage(file));
});
