"use client";

import { useState } from "react";
import ProjectCard from "./ProjectCard";
import type { Project } from "./types";

type Props = {
  /** order 순으로 정렬된 전체 프로젝트 */
  projects: Project[];
};

/** 대표 프로젝트 / 전체 프로젝트 토글이 있는 프로젝트 그리드 */
export default function ProjectsShowcase({ projects }: Props) {
  const [showAll, setShowAll] = useState<boolean>(false);
  const visibleProjects: Project[] = showAll
    ? projects
    : projects.filter((project) => project.featured);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
          Projects
        </h2>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="w-4 h-4 rounded border-brand-muted text-brand-accent focus:ring-brand-muted dark:bg-brand-dark-card dark:border-brand-muted/40 accent-brand-muted"
          />
          <span className="text-sm font-semibold text-brand-dark/80 dark:text-brand-light/80">
            전체 프로젝트 보기
          </span>
        </label>
      </div>

      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {visibleProjects.map((project) => (
          <li key={project._id} className="flex">
            <div className="w-full h-full">
              <ProjectCard project={project} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
