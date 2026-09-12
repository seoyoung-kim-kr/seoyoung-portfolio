import { cache } from "react";
import {
  sanityFetch,
  ALL_PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_BY_SLUG_QUERY,
} from "./sanity";

export type Post = {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  date?: string; // Legacy
  category: string;
  company?: string;
  path: string;
  featured: boolean;
  skills?: string[];
  demoUrl?: string;
  githubUrl?: string;
  role?: string;
  image?: string;
  content?: string;
};

export type PostData = Post & {
  content: string;
  next: Post | null;
  prev: Post | null;
};

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const sanityPosts = await sanityFetch<Post[]>(ALL_PROJECTS_QUERY);
  return sanityPosts || [];
});

export async function getFeaturedPosts(): Promise<Post[]> {
  const sanityPosts = await sanityFetch<Post[]>(FEATURED_PROJECTS_QUERY);
  if (sanityPosts && sanityPosts.length > 0) {
    return sanityPosts;
  }
  return getAllPosts().then((posts) =>
    posts.filter((post) => post.featured)
  );
}

export async function getPostData(fileName: string): Promise<PostData> {
  const posts = await getAllPosts();
  const currentIndex = posts.findIndex((post) => post.path === fileName);
  const prev = posts[currentIndex + 1] ?? null;
  const next = posts[currentIndex - 1] ?? null;

  const sanityPost = await sanityFetch<any>(PROJECT_BY_SLUG_QUERY, {
    slug: fileName,
  });

  if (sanityPost) {
    return {
      ...sanityPost,
      content: sanityPost.content || "",
      next,
      prev,
    };
  }

  const post = posts.find((post) => post.path === fileName);
  if (!post) throw new Error(`${fileName} not found`);

  return {
    ...post,
    content: "",
    next,
    prev,
  };
}
