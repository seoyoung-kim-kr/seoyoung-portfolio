"use client";

import React, { useState } from "react";
import PostsGrid from "./PostsGrid";
import type { Post } from "../service/posts";

type Props = {
  featuredPosts: Post[];
  allPosts: Post[];
};

export default function ProjectsClientWrapper({ featuredPosts, allPosts }: Props) {
  const [showAll, setShowAll] = useState(false);
  const postsToShow = showAll ? allPosts : featuredPosts;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
            Projects
          </h2>
        </div>
        
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

      <PostsGrid posts={postsToShow} variant="home" />
    </div>
  );
}
