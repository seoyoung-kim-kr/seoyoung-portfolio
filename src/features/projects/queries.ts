import { cache } from "react";
import { sanityFetch } from "@/src/shared/lib/sanity";
import { DEFAULT_PROJECT_ORDER, type Project, type ProjectWithNeighbors } from "./types";

const ALL_PROJECTS_QUERY = `
  *[_type == "post"] | order(coalesce(order, ${DEFAULT_PROJECT_ORDER}) asc, startDate desc) {
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

/** 잘못된 % 시퀀스(예: "abc%E0")는 URIError 를 던지므로, 그 경우 원본 문자열을 그대로 사용합니다. */
function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function findProjectIndex(projects: Project[], slug: string): number {
  // 한글 슬러그는 환경에 따라 인코딩된 상태로 전달될 수 있어 디코딩한 값과 함께 비교합니다.
  const decodedSlug = safeDecodeURIComponent(slug);
  return projects.findIndex(({ path }) => path === decodedSlug || path === slug);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects[findProjectIndex(projects, slug)] ?? null;
}

/** 상세 페이지용. 프로젝트와 함께 이전 / 다음 프로젝트를 반환합니다. */
export async function getProjectWithNeighbors(slug: string): Promise<ProjectWithNeighbors | null> {
  const projects = await getAllProjects();
  const index = findProjectIndex(projects, slug);

  if (index === -1) return null;

  return {
    ...projects[index],
    // 목록이 order 오름차순이므로 "이전"은 다음 인덱스, "다음"은 이전 인덱스입니다.
    prev: projects[index + 1] ?? null,
    next: projects[index - 1] ?? null,
  };
}
