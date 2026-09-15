"use client";

import type { Post } from "../service/posts";
import Link from "next/link";
import AdminActionButtons from "./AdminActionButtons";
import SkillBadge from "./SkillBadge";
import { FiCalendar, FiArrowRight, FiUserCheck } from "react-icons/fi";

type Props = { post: Post };

export default function BlogPostListItem({ post }: Props) {
  const { path, title, date, category, skills, role } = post;

  return (
    <article className="group relative py-6 border-b border-brand-muted/30 dark:border-brand-muted/20 last:border-b-0 space-y-3">
      {/* Admin Action Buttons */}
      <AdminActionButtons path={path} title={title} variant="floating" />

      {/* Top Header: Category, Date, Role */}
      <div className="flex items-center gap-3 text-xs flex-wrap pr-16 sm:pr-0">
        <span className="px-2.5 py-0.5 rounded-full font-bold bg-brand-pink/40 text-brand-dark dark:text-brand-light border border-brand-pink/60">
          {category}
        </span>
        {post.company && (
          <span className="inline-flex items-center gap-1 font-semibold text-brand-dark dark:text-brand-light bg-brand-pink/20 border border-brand-pink/40 px-2 py-0.5 rounded">
            <span>🏢 {post.company}</span>
          </span>
        )}
        <span className="flex items-center gap-1 text-brand-dark/60 dark:text-brand-light/60 font-medium">
          <FiCalendar className="w-3.5 h-3.5" />
          <time dateTime={date}>{date}</time>
        </span>
        {role && (
          <span className="inline-flex items-center gap-1 font-semibold text-brand-accent dark:text-brand-muted bg-brand-muted/15 dark:bg-brand-muted/10 px-2 py-0.5 rounded">
            <FiUserCheck className="w-3 h-3 text-brand-pink-dark" />
            <span>{role}</span>
          </span>
        )}
      </div>

      {/* Title */}
      <Link href={`/posts/${path}`} className="block">
        <h2 className="text-lg sm:text-xl font-bold text-brand-dark dark:text-brand-light group-hover:text-brand-accent dark:group-hover:text-brand-muted transition-colors leading-snug">
          {title}
        </h2>
      </Link>

      {/* Short Description */}
      {post.content && (
        <p className="text-sm sm:text-base text-brand-dark/75 dark:text-brand-light/75 leading-relaxed line-clamp-2 font-normal">
          {post.content.replace(/[#*`_[\]()>\-!]/g, "")}
        </p>
      )}

      {/* Footer: Skills Tags & Read Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {skills &&
            skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}
        </div>

        <Link
          href={`/posts/${path}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-accent dark:text-brand-muted group-hover:translate-x-1 transition-transform self-start sm:self-auto"
        >
          <span>포스트 읽기</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
