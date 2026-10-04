import { ValidationError } from "yup";
import { apiError, BadRequestError } from "@/src/shared/lib/apiResponse";
import { getErrorMessage } from "@/src/shared/lib/http";
import { ProjectNotFoundError } from "@/src/features/projects/mutations";
import { isAdminSession } from "./session";

/**
 * 관리자 전용 Route Handler 래퍼.
 * - 세션이 없으면 401
 * - 요청 형식 오류·입력 검증 실패는 400, 대상 없음은 404, 그 외 예외는 500 으로 변환합니다.
 *
 * `Context` 는 Next.js 가 넘겨주는 두 번째 인자(`{ params }`) 타입으로, 라우트마다 달라서 제네릭으로 받습니다.
 */
export function adminRoute<Context>(
  handler: (req: Request, context: Context) => Promise<Response>
) {
  return async (req: Request, context: Context): Promise<Response> => {
    if (!(await isAdminSession())) {
      return apiError("관리자 권한이 필요합니다.", 401);
    }

    try {
      return await handler(req, context);
    } catch (error) {
      if (error instanceof ValidationError) {
        return apiError(error.errors.join("\n"), 400);
      }
      if (error instanceof BadRequestError) {
        return apiError(error.message, 400);
      }
      if (error instanceof ProjectNotFoundError) {
        return apiError(error.message, 404);
      }
      console.error(error);
      return apiError(getErrorMessage(error, "요청 처리에 실패했습니다."), 500);
    }
  };
}
