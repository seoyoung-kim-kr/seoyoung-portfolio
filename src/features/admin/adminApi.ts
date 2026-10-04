import { jsonBody, requestApi } from "@/src/shared/lib/http";
// 아래는 모두 타입 전용 import 라 서버 모듈이 클라이언트 번들에 포함되지 않습니다.
import type { UploadedImage } from "@/src/shared/lib/sanity";
import type {
  ProjectInput,
  ProjectOrderInput,
  ProjectPatch,
} from "@/src/features/projects/projectInput";

/** 관리자 화면에서 사용하는 내부 API 호출 모음 (클라이언트) */
export const adminApi = {
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return requestApi<UploadedImage>("/api/upload", { method: "POST", body: formData });
  },

  createProject(input: ProjectInput) {
    return requestApi<{ slug: string }>("/api/posts", jsonBody("POST", input));
  },

  updateProject(idOrSlug: string, patch: ProjectPatch) {
    return requestApi(`/api/posts/${encodeURIComponent(idOrSlug)}`, jsonBody("PUT", patch));
  },

  deleteProject(idOrSlug: string) {
    return requestApi(`/api/posts/${encodeURIComponent(idOrSlug)}`, { method: "DELETE" });
  },

  saveProjectOrders(input: ProjectOrderInput) {
    return requestApi("/api/posts", jsonBody("PATCH", input));
  },
};
