import React from "react";
import { FiUser, FiGithub, FiMail, FiBookOpen } from "react-icons/fi";
import { SITE_CONFIG } from "../constants/site";

export default function AboutMeSection() {
  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-white/80 to-white/20 dark:from-brand-dark-card/80 dark:to-brand-dark-card/30 border border-white/80 dark:border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_6px_rgba(255,255,255,1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_6px_rgba(255,255,255,0.1)] transition-all hover:bg-white/50 dark:hover:bg-brand-dark-card/50 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-2xl bg-brand-muted/30 text-brand-dark dark:text-brand-light">
          <FiUser className="w-5 h-5" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark dark:text-brand-light">
          About Me
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 rounded-2xl">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-brand-accent dark:text-brand-muted w-14">
              Name
            </h3>
            <p className="text-base font-bold text-brand-dark dark:text-brand-light">
              {SITE_CONFIG.author.name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-brand-accent dark:text-brand-muted w-14">
              Email
            </h3>
            <a
              href={`mailto:${SITE_CONFIG.author.email}`}
              className="inline-flex items-center gap-1.5 text-base font-medium text-brand-dark dark:text-brand-light hover:text-brand-accent dark:hover:text-brand-muted hover:underline underline-offset-4 transition-colors"
            >
              <span>{SITE_CONFIG.author.email}</span>
            </a>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-brand-accent dark:text-brand-muted w-20">
              Education
            </h3>
            <p className="text-base font-medium text-brand-dark dark:text-brand-light">
              한신대학교 컴퓨터공학과
            </p>
          </div>
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-brand-accent dark:text-brand-muted w-20">
              GitHub
            </h3>
            <a
              href={SITE_CONFIG.author.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-base font-medium text-brand-dark dark:text-brand-light hover:text-brand-accent dark:hover:text-brand-muted hover:underline underline-offset-4 transition-colors"
            >
              <span>@seoyoung-kim-kr</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
