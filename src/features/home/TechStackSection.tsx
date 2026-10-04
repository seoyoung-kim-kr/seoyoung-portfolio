import type { IconType } from "react-icons";
import { FiCode, FiLayers, FiTool, FiDatabase } from "react-icons/fi";
import GlassCard from "@/src/shared/ui/GlassCard";
import SkillBadge from "@/src/shared/ui/SkillBadge";

type SkillCategory = {
  title: string;
  description?: string;
  Icon: IconType;
  /** 주력 기술 (강조 뱃지) */
  coreSkills: string[];
  /** 경험해 본 기술 (점선 뱃지). 비어 있으면 영역을 숨깁니다. */
  experiencedSkills?: string[];
};

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Language",
    Icon: FiCode,
    coreSkills: ["JavaScript", "TypeScript", "Python"],
  },
  {
    title: "Frontend",
    Icon: FiLayers,
    coreSkills: [
      "React 18",
      "Vite",
      "Next JS",
      "Shadcn UI",
      "Tailwind CSS",
      "TanStack Query / Table / Virtual",
      "react-hook-form",
      "Recharts",
      "dnd-kit",
      "Zod",
    ],
  },
  {
    title: "Infra/DB",
    Icon: FiDatabase,
    coreSkills: ["FastAPI", "SQLAlchemy", "PostgreSQL", "Sanity", "Docker"],
  },
  {
    title: "ETC",
    Icon: FiTool,
    coreSkills: ["Git", "ESLint / Prettier"],
  },
];

export default function TechStackSection() {
  return (
    <section className="space-y-6 pt-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
        Skills
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {SKILL_CATEGORIES.map(({ title, description, Icon, coreSkills, experiencedSkills = [] }) => (
          <GlassCard
            key={title}
            hoverLift
            className="p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-muted/25 dark:bg-brand-muted/20 text-brand-dark dark:text-brand-light">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-dark dark:text-brand-light">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {/* Core Skills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {coreSkills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} size="md" />
                ))}
              </div>

              {/* Experienced Skills */}
              {experiencedSkills.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-brand-muted/20 dark:border-brand-muted/10">
                  <div className="text-[11px] font-semibold text-brand-dark/60 dark:text-brand-light/60">
                    Experienced
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {experiencedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-brand-light/60 dark:bg-brand-dark-bg/60 text-brand-dark/80 dark:text-brand-light/80 border border-dashed border-brand-muted/40"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
