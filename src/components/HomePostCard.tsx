"use client";

import type { Post } from "../service/posts";
import Link from "next/link";
import MarkdownViewer from "./MarkdownViewer";
import GlassCard from "./GlassCard";
import AdminActionButtons from "./AdminActionButtons";
import SkillBadge from "./SkillBadge";
import {
  FiCalendar,
  FiArrowUpRight,
  FiGithub,
  FiExternalLink,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";

type Props = { post: Post & { content?: string } };

export default function HomePostCard({ post }: Props) {
  const {
    path,
    title,
    description,
    startDate,
    endDate,
    skills,
    githubUrl,
    demoUrl,
  } = post;

  return (
    <GlassCard
      hoverLift
      className="group relative p-5 sm:p-7 flex flex-col justify-between h-full space-y-4"
    >
      {/* Admin Action Buttons */}
      <AdminActionButtons path={path} title={title} variant="floating" />

      <div className="space-y-4">
        {/* Title and Date */}
        <div className="pr-16 sm:pr-0">
          {post.featured && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-brand-accent text-white dark:bg-brand-muted dark:text-brand-dark text-[11px] sm:text-xs font-bold shadow-md shadow-brand-accent/20">
              <FaStar className="w-3 h-3 text-yellow-300 dark:text-yellow-500" />
              <span>Featured</span>
            </div>
          )}
          <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark dark:text-brand-light group-hover:text-brand-accent dark:group-hover:text-brand-muted transition-colors leading-tight">
            <Link href={`/projects/${path}`}>{title}</Link>
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-dark/60 dark:text-brand-light/60 mt-2.5">
            <FiCalendar className="w-3.5 h-3.5" />
            <span>
              {startDate || "미상"} ~ {endDate || "진행중"}
            </span>
          </div>
        </div>

        {/* Description / Markdown Preview */}
        {description && (
          <div className="text-sm text-brand-dark/80 dark:text-brand-light/80 leading-relaxed font-normal">
            <MarkdownViewer content={description} />
          </div>
        )}
      </div>

      {/* Bottom Line: Skills Tags & Direct Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-brand-muted/20 mt-auto">
        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5">
          {skills &&
            skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-2 text-xs font-bold flex-wrap self-end sm:self-auto">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-light/80 dark:bg-brand-dark-bg/80 text-brand-dark dark:text-brand-light border border-brand-muted/40 hover:bg-brand-muted/25 transition-colors shadow-2xs"
            >
              <FiGithub className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-muted/30 text-brand-dark dark:text-brand-light border border-brand-muted/50 hover:bg-brand-muted/50 transition-colors shadow-2xs"
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}

          {/* 상세 페이지 이동 버튼 강조 */}
          <Link
            href={`/projects/${path}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-brand-pink/30 text-brand-dark hover:bg-brand-pink/50 dark:bg-brand-pink/10 dark:text-brand-light dark:hover:bg-brand-pink/20 transition-all shadow-sm active:scale-95 border border-brand-pink/60 dark:border-brand-pink/30"
          >
            <span>Detail</span>
            <FiArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
