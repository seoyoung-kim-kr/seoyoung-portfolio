"use client";

import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { toast } from "sonner";
import { FiSend } from "react-icons/fi";
import { getErrorMessage, jsonBody, requestApi } from "@/src/shared/lib/http";
// 타입만 가져오므로 서버 전용 모듈(nodemailer)이 클라이언트 번들에 포함되지 않습니다.
import type { ContactEmail } from "./email";

const EMPTY_FORM: ContactEmail = { from: "", subject: "", message: "" };

const FIELD_CLASS =
  "w-full rounded-2xl bg-white/80 dark:bg-brand-dark-bg/80 border border-brand-muted/50 text-sm text-brand-dark dark:text-brand-light placeholder:text-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-muted transition-all shadow-sm";
const LABEL_CLASS =
  "text-xs font-bold uppercase tracking-wider text-brand-dark/80 dark:text-brand-light/80";

export default function ContactForm() {
  const [form, setForm] = useState<ContactEmail>(EMPTY_FORM);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await requestApi("/api/contact", jsonBody("POST", form));
      toast.success("메일이 성공적으로 전송되었습니다.");
      setForm(EMPTY_FORM);
    } catch (error) {
      toast.error(getErrorMessage(error, "메일 전송에 실패했습니다."), {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="from" className={LABEL_CLASS}>
          Your Email
        </label>
        <input
          type="email"
          id="from"
          name="from"
          value={form.from}
          onChange={handleChange}
          placeholder="name@example.com"
          className={`${FIELD_CLASS} px-4 py-3`}
          required
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className={LABEL_CLASS}>
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          className={`${FIELD_CLASS} px-4 py-3`}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={LABEL_CLASS}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={6}
          placeholder="내용을 입력하세요..."
          className={`${FIELD_CLASS} p-4 resize-none`}
          required
        />
      </div>

      <button
        type="submit"
        id="contact-submit"
        disabled={isSending}
        className="w-full py-3.5 px-6 rounded-full bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 border border-brand-muted/60"
      >
        <FiSend className="w-4 h-4" />
        <span>{isSending ? "Sending..." : "Send Message"}</span>
      </button>
    </form>
  );
}
