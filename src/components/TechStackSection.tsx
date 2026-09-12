import React from "react";
import {
  FiCode,
  FiLayers,
  FiCpu,
  FiTool,
  FiDatabase,
  FiServer,
  FiCheckCircle,
} from "react-icons/fi";
import { sanityFetch, TECH_STACK_QUERY } from "@/src/service/sanity";

export type TechCategoryItem = {
  category?: string;
  title?: string;
  description?: string;
  icon?: string;
  coreSkills?: string[];
  experiencedSkills?: string[];
};

const ICON_MAP: Record<string, React.ElementType> = {
  FiCode,
  FiLayers,
  FiCpu,
  FiTool,
  FiDatabase,
  FiServer,
};

type Category = {
  title: string;
  description: string;
  iconName: string;
  coreSkills: string[];
  experiencedSkills: string[];
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    title: "Language",
    description: "",
    iconName: "FiCode",
    coreSkills: ["JavaScript", "TypeScript", "Python"],
    experiencedSkills: [],
  },
  {
    title: "Frontend",
    description: "",
    iconName: "FiLayers",
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
    experiencedSkills: [],
  },
  {
    title: "Infra/DB",
    description: "",
    iconName: "FiDatabase",
    coreSkills: ["FastAPI", "SQLAlchemy", "PostgreSQL", "Sanity", "Docker"],
    experiencedSkills: [],
  },
  {
    title: "ETC",
    description: "",
    iconName: "FiTool",
    coreSkills: ["Git", "ESLint / Prettier"],
    experiencedSkills: [],
  },
];

export default async function TechStackSection({
  hideHeader = false,
}: {
  hideHeader?: boolean;
} = {}) {
  // Sanity에서 데이터를 가져오는 대신 하드코딩된 데이터를 사용하도록 변경
  // const sanityTechData = await sanityFetch<TechCategoryItem[]>(TECH_STACK_QUERY);
  const categories = DEFAULT_CATEGORIES;

  return (
    <section className={hideHeader ? "space-y-6" : "space-y-6 pt-4"}>
      {!hideHeader && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
            Skills
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((category) => {
          const IconComponent = ICON_MAP[category.iconName] || FiCode;
          const validCoreSkills = (category.coreSkills || []).filter((s) =>
            Boolean(s && s.trim()),
          );
          const validExperiencedSkills = (
            category.experiencedSkills || []
          ).filter((s) => Boolean(s && s.trim()));
          const hasExperienced = validExperiencedSkills.length > 0;

          return (
            <div
              key={category.title}
              className="p-6 rounded-3xl bg-linear-to-br from-white/80 to-white/20 dark:from-brand-dark-card/80 dark:to-brand-dark-card/30 border border-white/80 dark:border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_6px_rgba(255,255,255,1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_6px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_2px_6px_rgba(255,255,255,1)] hover:bg-white/50 dark:hover:bg-brand-dark-card/50 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-brand-muted/25 dark:bg-brand-muted/20 text-brand-dark dark:text-brand-light">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brand-dark dark:text-brand-light">
                      {category.title}
                    </h3>
                    {category.description && (
                      <p className="text-xs text-brand-dark/60 dark:text-brand-light/60">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Core Skills */}
                {validCoreSkills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {validCoreSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-brand-muted/25 dark:bg-brand-muted/20 text-brand-dark dark:text-brand-light border border-brand-muted/50 shadow-2xs hover:bg-brand-pink/50 dark:hover:bg-brand-pink/30 hover:border-brand-pink/60 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experienced Skills */}
                {hasExperienced && (
                  <div className="space-y-1.5 pt-2 border-t border-brand-muted/20 dark:border-brand-muted/10">
                    <div className="text-[11px] font-semibold text-brand-dark/60 dark:text-brand-light/60">
                      Experienced
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {validExperiencedSkills.map((skill) => (
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
