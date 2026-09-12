import React from "react";
import Link from "next/link";
import { FiMail, FiArrowRight } from "react-icons/fi";

export default function ContactCTA() {
  return (
    <section className="p-8 sm:p-10 rounded-3xl bg-linear-to-br from-white/80 to-white/20 dark:from-brand-dark-card/80 dark:to-brand-dark-card/30 backdrop-blur-2xl border border-white/80 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_6px_rgba(255,255,255,1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_6px_rgba(255,255,255,0.1)] transition-all flex flex-col sm:flex-row items-center justify-between gap-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark dark:text-brand-light tracking-tight">
        Let's Connect 📬
      </h2>

      <Link
        href="/contact"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 border border-brand-muted/60"
      >
        <FiMail className="w-4 h-4" />
        <span>Contact Me</span>
        <FiArrowRight className="w-4 h-4" />
      </Link>
    </section>
  );
}
