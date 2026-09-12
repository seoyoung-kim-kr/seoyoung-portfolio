"use client";

import { useState } from "react";
import { Post } from "../service/posts";
import PostsGrid from "./PostsGrid";
import Categories from "./Categories";
import Container from "./Container";
import { useAdmin } from "../context/AdminContext";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

type Props = {
  posts: Post[];
  categories: string[];
};

const ALL_POSTS = "All Posts";

export default function FilterablePosts({ posts, categories }: Props) {
  const [selected, setSelected] = useState(ALL_POSTS);
  const { isAdmin } = useAdmin();

  const filtered =
    selected === ALL_POSTS
      ? posts
      : posts.filter((post) => post.category === selected);

  return (
    <Container className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-muted/30 pb-6">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
            Tech Retrospectives
          </h1>
          <p className="text-brand-dark/70 dark:text-brand-light/70 text-sm sm:text-base">
            실무 및 주요 프로젝트에서의 기술적 도전과 문제 해결 과정을 기록한 상세 회고 모음입니다.
          </p>
        </div>

        {/* Admin Create Button */}
        {isAdmin && (
          <Link
            href="/sy-admin/write"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 border border-brand-muted/60 shrink-0 self-center md:self-auto"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        )}
      </div>

      {/* Main Content Layout: Grid on Left, Categories Sidebar on Right */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Posts Grid (Left Side) */}
        <div className="flex-1 w-full min-w-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-brand-dark/60 dark:text-brand-light/60 font-medium">
              해당 카테고리의 프로젝트가 존재하지 않습니다.
            </div>
          ) : (
            <PostsGrid posts={filtered} variant="blog" />
          )}
        </div>

        {/* Categories Sidebar (Right Side - Sticky on Desktop) */}
        <aside className="w-full md:w-56 lg:w-64 shrink-0 md:sticky md:top-24">
          <div className="p-5 rounded-3xl bg-white/90 dark:bg-brand-dark-card/90 border border-brand-muted/40 dark:border-brand-muted/20 backdrop-blur-md shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-extrabold text-brand-accent dark:text-brand-muted uppercase tracking-wider">
                Domains & Tech
              </h2>
              <span className="text-[11px] font-semibold text-brand-dark/60 dark:text-brand-light/60">
                {filtered.length} items
              </span>
            </div>
            <Categories
              categories={[ALL_POSTS, ...categories]}
              selected={selected}
              onClick={setSelected}
            />
          </div>
        </aside>
      </div>
    </Container>
  );
}

