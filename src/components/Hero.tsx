import Link from "next/link";
import { FiArrowRight, FiMail } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Headline & Bio */}
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-brand-pink/40 text-brand-dark dark:text-brand-light border border-brand-pink/60 mb-4 shadow-sm">
          Frontend Developer
        </span>

        <h2 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light mb-4 break-keep">
          안녕하세요, 프론트엔드 개발자
          <br />
          <span className="bg-linear-to-r from-brand-accent via-brand-dark to-brand-pink-dark dark:from-brand-muted dark:to-brand-pink bg-clip-text text-transparent">
            김서영{" "}
          </span>
          입니다.
        </h2>

        <p className="text-sm sm:text-lg text-brand-dark/80 dark:text-brand-light/80 max-w-xl mb-8 leading-relaxed font-normal break-keep">
          흔들림 없는 컴포넌트 아키텍처와 최적화된 성능을 구축합니다.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 border border-brand-muted/50"
          >
            <span>Explore Projects</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-pink/40 hover:bg-brand-pink/70 text-brand-dark dark:text-brand-light text-sm font-bold border border-brand-pink/60 shadow-sm transition-all duration-200 active:scale-95 backdrop-blur-md"
          >
            <FiMail className="w-4 h-4" />
            <span>Contact Me</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
