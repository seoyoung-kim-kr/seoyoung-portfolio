import Link from "next/link";
import { FiMail, FiArrowRight } from "react-icons/fi";
import GlassCard from "./GlassCard";

export default function ContactCTA() {
  return (
    <GlassCard className="p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
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
    </GlassCard>
  );
}
