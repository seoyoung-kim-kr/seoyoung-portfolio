import { redirect } from "next/navigation";
// import FilterablePosts from "@/src/components/FilterablePosts";
// import { getAllPosts } from "@/src/service/posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "프론트엔드 개발자 김서영의 프로젝트입니다.",
};

export default async function ProjectsPage() {
  /*
  추후 블로그 목록용 코드로 재사용하기 위해 주석 처리
  const posts = await getAllPosts();
  const categories = [...new Set(posts.map((post) => post.category))];

  return <FilterablePosts posts={posts} categories={categories} />;
  */
  
  redirect('/#projects');
}
