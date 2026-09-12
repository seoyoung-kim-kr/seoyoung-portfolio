"use client";

import React, { useState } from "react";
import type { Post } from "../service/posts";
import Link from "next/link";
import { useAdmin } from "../context/AdminContext";
import { useDeleteProject } from "../hooks/useDeleteProject";
import MarkdownViewer from "./MarkdownViewer";
import {
  FiCalendar,
  FiArrowUpRight,
  FiGithub,
  FiExternalLink,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Props = { post: Post & { content?: string } };

export default function HomePostCard({ post }: Props) {
  const {
    path,
    title,
    description,
    content,
    startDate,
    endDate,
    skills,
    githubUrl,
    demoUrl,
  } = post;
  const { isAdmin } = useAdmin();
  const { deleteProject, deleting } = useDeleteProject();
  const router = useRouter();

  const hasFullContent = Boolean(content && content.trim());

  return (
    <div className="group relative rounded-3xl bg-linear-to-br from-white/80 to-white/20 dark:from-brand-dark-card/80 dark:to-brand-dark-card/30 border border-white/80 dark:border-white/20 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_6px_rgba(255,255,255,1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_6px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_2px_6px_rgba(255,255,255,1)] transition-all duration-300 flex flex-col justify-between h-full space-y-4">
      {/* Admin Action Buttons */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/90 dark:bg-brand-dark-base/90 border border-brand-muted/50 shadow-md backdrop-blur-md">
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
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-muted/25 dark:bg-brand-muted/20 text-brand-dark dark:text-brand-light border border-brand-muted/40 hover:bg-brand-pink/50 dark:hover:bg-brand-pink/30 hover:border-brand-pink/60 transition-colors cursor-default"
              >
                {skill}
              </span>
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
    </div>
  );
}
