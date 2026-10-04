/** Sanity 스튜디오 스키마(studio/schemaTypes/post.ts)의 category 목록과 동일하게 유지해야 합니다. */
export const PROJECT_CATEGORIES = [
  "frontend",
  "backend",
  "javascript",
  "my-story",
  "retrospective",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** 조회 쿼리(queries.ts)의 GROQ projection 결과 형태 */
export type Project = {
  _id: string;
  /** 정렬 순서. 낮을수록 먼저 노출되며 미지정 문서는 기본값(DEFAULT_PROJECT_ORDER)으로 취급합니다. */
  order?: number;
  title: string;
  /** 카드에 표시되는 마크다운 요약 */
  description: string;
  /** 상세 페이지 본문 마크다운 */
  content?: string;
  /** YYYY-MM-DD */
  startDate?: string;
  /** YYYY-MM-DD. 비어 있으면 진행 중으로 표시합니다. */
  endDate?: string;
  category: ProjectCategory;
  company?: string;
  /** URL 슬러그 (slug.current, 없으면 레거시 path 필드) */
  path: string;
  featured: boolean;
  skills?: string[];
  demoUrl?: string;
  githubUrl?: string;
  role?: string;
  /** 썸네일 이미지 CDN URL */
  image?: string;
};

export type ProjectWithNeighbors = Project & {
  prev: Project | null;
  next: Project | null;
};

export const DEFAULT_PROJECT_ORDER = 99;
