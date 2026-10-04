import type { MetadataRoute } from "next";
import type { Project } from "@/src/features/projects/types";
import { getAllProjects } from "@/src/features/projects/queries";
import { SITE_CONFIG } from "@/src/shared/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  // Sanity 조회 실패 시에도 정적 경로만으로 sitemap 을 생성합니다.
  const projects: Project[] = await getAllProjects().catch(() => []);
  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.path}`,
    lastModified: new Date(project.startDate || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 정적 경로들 (실제 존재하는 라우트만 포함)
  const routes = ["", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.9,
  }));

  return [...routes, ...projectUrls];
}
