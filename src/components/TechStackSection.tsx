import { FiCode, FiLayers, FiTool, FiDatabase } from "react-icons/fi";
import GlassCard from "./GlassCard";
import SkillBadge from "./SkillBadge";

const ICON_MAP: Record<string, React.ElementType> = {
  FiCode,
  FiLayers,
  FiTool,
  FiDatabase,
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
            <GlassCard
              key={category.title}
              hoverLift
              className="p-6 space-y-4 flex flex-col justify-between"
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
                        <SkillBadge key={skill} skill={skill} size="md" />
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
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
