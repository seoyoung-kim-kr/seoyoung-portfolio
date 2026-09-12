"use client";

import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  FiGithub,
  FiExternalLink,
  FiLayers,
  FiEdit2,
  FiTrash2,
  FiUserCheck,
} from "react-icons/fi";
import { PostData } from "../service/posts";
import MarkdownViewer from "./MarkdownViewer";
import { useAdmin } from "../context/AdminContext";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useRouter } from "next/navigation";

function PostContent({ post }: { post: PostData }) {
  const {
    path,
    title,
    date,
    startDate,
    endDate,
    content,
    category,
    skills,
    githubUrl,
    demoUrl,
    role,
  } = post;
  const { isAdmin } = useAdmin();
  const { deleteProject, deleting } = useDeleteProject();
  const router = useRouter();

  return (
    <section className="p-6 sm:p-10 space-y-8 relative">
      {/* Admin Actions Bar in Detail Page */}
      {isAdmin && (
        <div className="flex items-center justify-end gap-2 max-w-3xl mx-auto">
          <button
            onClick={() => router.push(`/sy-admin/edit/${path}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-muted/40 hover:bg-brand-muted/70 text-brand-dark dark:text-brand-light text-xs font-bold border border-brand-muted"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
            <span>Edit Project</span>
          </button>
          <button
            onClick={() => deleteProject(path, title, true)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold border border-red-300 disabled:opacity-50"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span>Delete Project</span>
          </button>
        </div>
      )}

      {/* Project Specs Header */}
      <header
        className={`max-w-3xl mx-auto flex flex-col items-start ${
          content
            ? "pb-10 border-b border-slate-200/60 dark:border-slate-800/60 mb-10"
            : ""
        }`}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.3] break-keep mb-6">
          {title}
        </h1>

        {/* Tags / Categories / Skills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {category && (
            <span className="px-3 py-1.5 rounded-full text-[13px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              #{category}
            </span>
          )}
          {skills &&
            skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-full text-[13px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                #{skill}
              </span>
            ))}
        </div>

        {/* Author / Date Info */}
        <div className="flex flex-col gap-1.5 text-[15px] text-gray-500 dark:text-gray-400">
          <div className="font-semibold text-gray-700 dark:text-gray-300">
            Seoyoung Kim
            {role ? ` · ${role}` : ""}
            {post.company ? ` @ ${post.company}` : ""}
          </div>
          <div className="text-[14px] flex items-center gap-1.5 mt-0.5">
            <FaRegCalendarAlt className="w-3.5 h-3.5" />
            {startDate ? (
              <time>
                {startDate} ~ {endDate || "진행 중"}
              </time>
            ) : (
              <time dateTime={date}>{date}</time>
            )}
          </div>
        </div>

        {/* Quick Project Action Buttons */}
        {(githubUrl || demoUrl) && (
          <div className="flex items-center gap-3 pt-8 mt-2">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                <FiExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-brand-dark-card hover:bg-gray-50 dark:hover:bg-brand-dark-base text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95"
              >
                <FiGithub className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>
        )}
      </header>

      {/* Main Documentation / Case Study Content */}
      {content && (
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="prose-container">
            <MarkdownViewer content={content} />
          </div>
        </div>
      )}
    </section>
  );
}

export default PostContent;
