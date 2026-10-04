import * as yup from "yup";
import { PROJECT_CATEGORIES } from "./types";

const NOT_OBJECT_MESSAGE = "요청 본문은 JSON 객체여야 합니다.";

/**
 * 프로젝트 생성/수정 요청 body 스키마.
 * 서버(Route Handler)에서 검증에 사용하고, 클라이언트(에디터)는 타입만 import 합니다.
 */
export const projectInputSchema = yup
  .object({
    title: yup.string().trim().required("제목은 필수입니다."),
    slug: yup.string().trim(),
    description: yup.string().trim().required("설명은 필수입니다."),
    category: yup
      .string()
      .oneOf(
        PROJECT_CATEGORIES,
        `카테고리는 ${PROJECT_CATEGORIES.join(", ")} 중 하나여야 합니다.`,
      )
      .required("카테고리는 필수입니다."),
    order: yup
      .number()
      .typeError("정렬 순서는 숫자여야 합니다.")
      .integer("정렬 순서는 정수여야 합니다."),
    startDate: yup.string(),
    endDate: yup.string(),
    company: yup.string(),
    featured: yup
      .boolean()
      .typeError("대표 프로젝트 여부는 true/false 여야 합니다."),
    skills: yup
      .array(yup.string().required())
      .typeError("기술 스택은 문자열 배열이어야 합니다."),
    demoUrl: yup.string().url("Live Demo 주소 형식이 올바르지 않습니다."),
    githubUrl: yup.string().url("GitHub 주소 형식이 올바르지 않습니다."),
    role: yup.string(),
    content: yup.string(),
    /** 업로드 API 가 반환한 Sanity 이미지 asset id */
    assetId: yup.string(),
  })
  .typeError(NOT_OBJECT_MESSAGE)
  .nonNullable(NOT_OBJECT_MESSAGE);

export const projectPatchSchema = projectInputSchema.partial();

export const projectOrderSchema = yup
  .object({
    orders: yup
      .array(
        yup.object({
          id: yup.string().required("정렬할 프로젝트 id 가 필요합니다."),
          order: yup
            .number()
            .typeError("정렬 순서는 숫자여야 합니다.")
            .integer("정렬 순서는 정수여야 합니다.")
            .required("정렬 순서 값이 필요합니다."),
        }),
      )
      .typeError("정렬 목록은 배열이어야 합니다.")
      .required("정렬 목록이 필요합니다."),
  })
  .typeError(NOT_OBJECT_MESSAGE)
  .nonNullable(NOT_OBJECT_MESSAGE);

export type ProjectInput = yup.InferType<typeof projectInputSchema>;
export type ProjectPatch = yup.InferType<typeof projectPatchSchema>;
export type ProjectOrderInput = yup.InferType<typeof projectOrderSchema>;

/** 정의되지 않은 필드는 제거하고, 모든 검증 에러를 한 번에 모아서 반환하도록 검증합니다. */
export function parseBody<S extends yup.AnySchema>(
  schema: S,
  body: unknown,
): Promise<yup.InferType<S>> {
  return schema.validate(body, { abortEarly: false, stripUnknown: true });
}
