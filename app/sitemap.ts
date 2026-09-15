import { MetadataRoute } from "next";
import { getAllPosts } from "@/src/service/posts";
import { SITE_CONFIG } from "@/src/constants/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  // 동적 포스트 / 프로젝트 경로 가져오기
  const posts = await getAllPosts().catch(() => []);
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/projects/${post.path}`,
    lastModified: new Date(post.startDate || Date.now()),
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

  return [...routes, ...postUrls];
}
