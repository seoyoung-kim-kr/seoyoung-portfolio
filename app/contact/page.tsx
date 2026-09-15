import type { IconType } from "react-icons";
import { FaGithub } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import Link from "next/link";
import ContactForm from "@/src/components/ContactForm";
import type { Metadata } from "next";
import Container from "@/src/components/Container";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "프론트엔드 개발자 김서영과의 협업 문의 및 이메일 전송 페이지입니다.",
};

const socialLinks: { href: string; label: string; Icon: IconType }[] = [
  {
    href: "https://github.com/seoyoung-kim-kr",
    label: "GitHub",
    Icon: FaGithub,
  },
];

export default function ContactPage() {
  return (
    <Container className="max-w-2xl py-12 sm:py-16">
      <div className="rounded-3xl bg-white/90 dark:bg-brand-dark-card/90 border border-brand-muted/40 dark:border-brand-muted/20 backdrop-blur-xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-pink/40 text-brand-dark dark:text-brand-light border border-brand-pink/60 shadow-sm">
            📬 Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
            Contact Me
          </h1>
          <p className="text-sm text-brand-dark/70 dark:text-brand-light/70 max-w-sm mx-auto">
            질문이나 협업 문의, 메시지는 언제든지 편하게 보내주세요.
          </p>

          <a
            href="mailto:seoyoung.k.kr@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-muted/20 hover:bg-brand-muted/40 text-brand-dark dark:text-brand-light text-xs sm:text-sm font-bold transition-all border border-brand-muted/40"
          >
            <FiMail className="w-4 h-4 text-brand-accent dark:text-brand-muted" />
            <span>seoyoung.k.kr@gmail.com</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {socialLinks.map(({ href, label, Icon }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              aria-label={label}
              className="p-3 rounded-2xl bg-brand-muted/20 hover:bg-brand-muted hover:text-brand-dark text-brand-dark dark:text-brand-light transition-all duration-300 hover:scale-110 shadow-sm border border-brand-muted/30"
            >
              <Icon size={24} />
            </Link>
          ))}
        </div>

        <div className="w-full h-px bg-brand-muted/30 dark:bg-brand-muted/20" />

        {/* Form Container */}
        <div>
          <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light mb-6 text-center">
            Send Me an Email
          </h2>
          <ContactForm />
        </div>
      </div>
    </Container>
  );
}
