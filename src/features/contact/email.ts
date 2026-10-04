import nodemailer from "nodemailer";
import * as yup from "yup";

/** 문의 메일 발송 (서버 전용) */

export const contactSchema = yup
  .object({
    from: yup
      .string()
      .trim()
      .required("※ 이메일을 입력해주세요.")
      .email("※ 이메일 형식이 올바르지 않습니다."),
    subject: yup.string().trim().required("※ 제목을 입력해주세요."),
    message: yup.string().trim().required("※ 내용을 입력해주세요."),
  })
  .typeError("※ 요청 본문은 JSON 객체여야 합니다.")
  .nonNullable("※ 요청 본문은 JSON 객체여야 합니다.");

export type ContactEmail = yup.InferType<typeof contactSchema>;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export async function sendEmail({ from, subject, message }: ContactEmail) {
  const safeSubject = escapeHtml(subject);

  return transporter.sendMail({
    to: process.env.AUTH_USER,
    // Gmail SMTP 는 from 을 인증 계정으로 덮어쓰므로, 답장이 방문자에게 가도록 replyTo 를 지정합니다.
    replyTo: from,
    from,
    subject: `[PORTFOLIO] ${subject}`,
    html: `
      <h1>${safeSubject}</h1>
      <div style="white-space: pre-wrap">${escapeHtml(message)}</div>
      <br/>
      <p>보낸사람: ${escapeHtml(from)}</p>
    `,
  });
}
