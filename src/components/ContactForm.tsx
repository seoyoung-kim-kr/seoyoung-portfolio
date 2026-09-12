"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast, Toaster } from "sonner";
import { sendContactEmail } from "../service/contact";
import { FiSend } from "react-icons/fi";

const DEFAULT_DATA = {
  from: "",
  subject: "",
  message: "",
};

type Form = typeof DEFAULT_DATA;

export default function ContactForm() {
  const [form, setForm] = useState<Form>(DEFAULT_DATA);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    sendContactEmail(form)
      .then(() => {
        toast.success("메일이 성공적으로 전송되었습니다.");
        setForm(DEFAULT_DATA);
      })
      .catch((err) => {
        toast.error(err?.message || "메일 전송에 실패했습니다.", {
          style: {
            whiteSpace: "pre-line",
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="from" className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 dark:text-brand-light/80">
            Your Email
          </label>
          <input
            type="email"
            id="from"
            name="from"
            value={form.from}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full rounded-2xl bg-white/80 dark:bg-brand-dark-bg/80 border border-brand-muted/50 px-4 py-3 text-sm text-brand-dark dark:text-brand-light placeholder:text-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-muted transition-all shadow-sm"
            required
            autoFocus
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 dark:text-brand-light/80">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            className="w-full rounded-2xl bg-white/80 dark:bg-brand-dark-bg/80 border border-brand-muted/50 px-4 py-3 text-sm text-brand-dark dark:text-brand-light placeholder:text-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-muted transition-all shadow-sm"
            required
          />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-brand-dark/80 dark:text-brand-light/80">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            placeholder="내용을 입력하세요..."
            className="w-full rounded-2xl bg-white/80 dark:bg-brand-dark-bg/80 border border-brand-muted/50 p-4 text-sm text-brand-dark dark:text-brand-light placeholder:text-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-muted transition-all resize-none shadow-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-sm font-extrabold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 border border-brand-muted/60"
        >
          <FiSend className="w-4 h-4" />
          <span>{loading ? "Sending..." : "Send Message"}</span>
        </button>
      </form>
    </>
  );
}
