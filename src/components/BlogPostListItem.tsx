"use client";

import React from "react";
import type { Post } from "../service/posts";
import Link from "next/link";
import { useAdmin } from "../context/AdminContext";
import { useDeleteProject } from "../hooks/useDeleteProject";
import {
  FiCalendar,
  FiArrowRight,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

type Props = { post: Post };

export default function BlogPostListItem({ post }: Props) {
  const { path, title, description, date, category, skills, role } = post;
  const { isAdmin } = useAdmin();
  const { deleteProject, deleting } = useDeleteProject();
  const router = useRouter();

  return (
    <article className="group relative py-6 border-b border-brand-muted/30 dark:border-brand-muted/20 last:border-b-0 space-y-3">
      {/* Admin Action Buttons */}
      {isAdmin && (
        <div className="absolute top-6 right-0 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/90 dark:bg-brand-dark-base/90 border border-brand-muted/50 shadow-md backdrop-blur-md">
          <button
            onClick={() => router.push(`/sy-admin/edit/${path}`)}
            title="프로젝트 수정"
            className="p-1.5 rounded-full hover:bg-brand-muted/30 text-brand-dark dark:text-brand-light transition-colors"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteProject(path, title)}
            disabled={deleting}
            title="프로젝트 삭제"
            className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors disabled:opacity-50"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
            skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand-muted/20 dark:bg-brand-muted/15 text-brand-dark/90 dark:text-brand-light/90 border border-brand-muted/30"
              >
                {skill}
              </span>
            ))}
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
