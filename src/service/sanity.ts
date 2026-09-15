import { SANITY_CONFIG } from "./sanityConfig";

export async function sanityFetch<T>(
  query: string,
  params: Record<string, any> = {},
  revalidateSeconds: number = 60
): Promise<T | null> {
  try {
    let url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${encodeURIComponent(
      query
    )}`;

    for (const [key, value] of Object.entries(params)) {
      url += `&$${key}=${encodeURIComponent(JSON.stringify(value))}`;
    }

    const res = await fetch(url, {
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return (json.result as T) ?? null;
  } catch (error) {
    console.warn("Sanity fetch warning:", error);
    return null;
  }
}

export const ALL_PROJECTS_QUERY = `
  *[_type == "post"] | order(startDate desc) {
    title,
    description,
    content,
    startDate,
    endDate,
    category,
    company,
    "path": select(defined(slug.current) => slug.current, path),
    featured,
    skills,
    demoUrl,
    githubUrl,
    role,
    "image": image.asset->url
  }
`;

export const FEATURED_PROJECTS_QUERY = `
  *[_type == "post" && featured == true] | order(startDate desc) {
    title,
    description,
    content,
    startDate,
    endDate,
    category,
    company,
    "path": select(defined(slug.current) => slug.current, path),
    featured,
    skills,
    demoUrl,
    githubUrl,
    role,
    "image": image.asset->url
  }
`;

export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "post" && (path == $slug || slug.current == $slug)][0] {
    title,
    description,
    startDate,
    endDate,
    category,
    company,
    "path": select(defined(slug.current) => slug.current, path),
    featured,
    skills,
    demoUrl,
    githubUrl,
    role,
    content,
    "image": image.asset->url
  }
`;
