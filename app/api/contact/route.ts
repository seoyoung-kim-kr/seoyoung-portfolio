import { ValidationError } from "yup";
import { apiError, apiOk, BadRequestError, readJsonBody } from "@/src/shared/lib/apiResponse";
import { contactSchema, sendEmail } from "@/src/features/contact/email";

export async function POST(req: Request) {
  try {
    const email = await contactSchema.validate(await readJsonBody(req), {
      abortEarly: false,
      stripUnknown: true,
    });
    await sendEmail(email);
    return apiOk({});
  } catch (error) {
    if (error instanceof ValidationError) {
      return apiError(error.errors.join("\n"), 400);
    }
    if (error instanceof BadRequestError) {
      return apiError(error.message, 400);
    }
    console.error(error);
    return apiError("메일 전송에 실패했습니다.", 500);
  }
}
