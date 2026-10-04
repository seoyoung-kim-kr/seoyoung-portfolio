import * as yup from "yup";
import { PROJECT_CATEGORIES } from "./types";

/**
 * 프로젝트 생성/수정 요청 body 스키마.
 * 서버(Route Handler)에서 검증에 사용하고, 클라이언트(에디터)는 타입만 import 합니다.
 */
export const projectInputSchema = yup.object({
  title: yup.string().trim().required("제목은 필수입니다."),
  slug: yup.string().trim(),
  description: yup.string().trim().required("설명은 필수입니다."),
  category: yup.string().oneOf(PROJECT_CATEGORIES).required("카테고리는 필수입니다."),
  order: yup.number().integer(),
  startDate: yup.string(),
  endDate: yup.string(),
  company: yup.string(),
  featured: yup.boolean(),
  skills: yup.array(yup.string().required()),
  demoUrl: yup.string().url("Live Demo 주소 형식이 올바르지 않습니다."),
  githubUrl: yup.string().url("GitHub 주소 형식이 올바르지 않습니다."),
  role: yup.string(),
  content: yup.string(),
  /** 업로드 API 가 반환한 Sanity 이미지 asset id */
  assetId: yup.string(),
});

export const projectPatchSchema = projectInputSchema.partial();

export const projectOrderSchema = yup.object({
  orders: yup
    .array(
      yup.object({
        id: yup.string().required(),
        order: yup.number().integer().required(),
      })
    )
    .required(),
});

export type ProjectInput = yup.InferType<typeof projectInputSchema>;
export type ProjectPatch = yup.InferType<typeof projectPatchSchema>;
export type ProjectOrderInput = yup.InferType<typeof projectOrderSchema>;

/** 정의되지 않은 필드는 제거하고, 모든 검증 에러를 한 번에 모아서 반환하도록 검증합니다. */
export function parseBody<S extends yup.AnySchema>(schema: S, body: unknown): Promise<yup.InferType<S>> {
  return schema.validate(body, { abortEarly: false, stripUnknown: true });
}
