import React from "react";
import { Post } from "../service/posts";
import PostCard from "./PostCard";

type Props = {
  posts: Post[];
  variant?: "home" | "blog";
};

export default function PostsGrid({ posts, variant = "home" }: Props) {
  if (variant === "blog") {
    return (
      <div className="divide-y divide-brand-muted/30 dark:divide-brand-muted/20">
        {posts.map((post) => (
          <PostCard key={post.path} post={post} variant="blog" />
        ))}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {posts.map((post) => (
        <li key={post.path} className="flex">
          <div className="w-full h-full">
            <PostCard key={post.path} post={post} variant="home" />
          </div>
        </li>
      ))}
    </ul>
  );
}
