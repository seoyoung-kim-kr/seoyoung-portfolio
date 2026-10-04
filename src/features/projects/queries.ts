import { cache } from "react";
import { sanityFetch } from "@/src/shared/lib/sanity";
import type { Project, ProjectWithNeighbors } from "./types";

const ALL_PROJECTS_QUERY = `
  *[_type == "post"] | order(order asc, startDate desc) {
    _id,
    order,
    title,
    description,
    content,
    startDate,
    endDate,
    category,
    company,
    "path": coalesce(slug.current, path),
    "featured": coalesce(featured, false),
    skills,
    demoUrl,
    githubUrl,
    role,
    "image": image.asset->url
  }
`;

/** 같은 요청 안에서 여러 컴포넌트가 호출해도 한 번만 조회하도록 React cache 로 감쌉니다. */
export const getAllProjects = cache(() => sanityFetch<Project[]>(ALL_PROJECTS_QUERY));

export async function getProjectBySlug(slug: string): Promise<ProjectWithNeighbors | null> {
  // 한글 슬러그는 환경에 따라 인코딩된 상태로 전달될 수 있어 디코딩한 값과 함께 비교합니다.
  const decodedSlug = decodeURIComponent(slug);
  const projects = await getAllProjects();
  const index = projects.findIndex(({ path }) => path === decodedSlug || path === slug);

  if (index === -1) return null;

  return {
    ...projects[index],
    // 목록이 order 오름차순이므로 "이전"은 다음 인덱스, "다음"은 이전 인덱스입니다.
    prev: projects[index + 1] ?? null,
    next: projects[index - 1] ?? null,
  };
}
