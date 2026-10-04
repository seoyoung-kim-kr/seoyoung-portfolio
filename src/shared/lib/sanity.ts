/**
 * Sanity HTTP API 클라이언트 (서버 전용).
 * SANITY_API_TOKEN 을 사용하므로 클라이언트 컴포넌트에서 import 하지 마세요.
 */

const SANITY_CONFIG = {
  // projectId / dataset 은 공개 값이므로 기본값을 둬도 보안상 문제가 없습니다.
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "s21m3wpb",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
} as const;

const API_BASE = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}`;

/** GROQ 파라미터로 바인딩 가능한 값. 쿼리 문자열에 직접 보간하지 않고 반드시 이 경로로 전달합니다. */
type GroqParams = Record<string, string | number | boolean>;

type SanityFetchOptions = {
  /** ISR 재검증 주기(초). `false` 이면 캐시하지 않습니다. */
  revalidate?: number | false;
  /** 토큰을 사용해 draft 문서까지 조회할지 여부 */
  withToken?: boolean;
};

function requireToken(): string {
  if (!SANITY_CONFIG.token) {
    throw new Error("SANITY_API_TOKEN 환경변수가 설정되어 있지 않습니다.");
  }
  return SANITY_CONFIG.token;
}

function buildQueryUrl(query: string, params: GroqParams): string {
  const searchParams = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) {
    // Sanity HTTP API 는 파라미터 값을 JSON 으로 인코딩해서 받습니다.
    searchParams.append(`$${key}`, JSON.stringify(value));
  }
  return `${API_BASE}/data/query/${SANITY_CONFIG.dataset}?${searchParams}`;
}

export async function sanityFetch<T>(
  query: string,
  params: GroqParams = {},
  { revalidate = 60, withToken = false }: SanityFetchOptions = {}
): Promise<T> {
  const res = await fetch(buildQueryUrl(query, params), {
    headers: withToken ? { Authorization: `Bearer ${requireToken()}` } : undefined,
    ...(revalidate === false ? { cache: "no-store" } : { next: { revalidate } }),
  });

  if (!res.ok) {
    throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
  }

  // 응답 형태는 호출부의 GROQ projection 으로 결정되므로 런타임 검증 없이 T 로 단언합니다.
  const json = (await res.json()) as { result: T };
  return json.result;
}

/** Sanity Mutation API 의 mutation 단위. 이 프로젝트에서 사용하는 형태만 정의합니다. */
export type SanityMutation =
  | { create: Record<string, unknown> & { _type: string } }
  | { patch: { id: string; set: Record<string, unknown> } }
  | { delete: { id: string } };

export async function sanityMutate(mutations: SanityMutation[]): Promise<void> {
  const res = await fetch(`${API_BASE}/data/mutate/${SANITY_CONFIG.dataset}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${requireToken()}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    throw new Error(`Sanity mutation failed (${res.status}): ${await res.text()}`);
  }
}

export type UploadedImage = { assetId: string; url: string };

export async function sanityUploadImage(file: File): Promise<UploadedImage> {
  const url = `${API_BASE}/assets/images/${SANITY_CONFIG.dataset}?filename=${encodeURIComponent(file.name)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": file.type,
      Authorization: `Bearer ${requireToken()}`,
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!res.ok) {
    throw new Error(`Sanity asset upload failed (${res.status}): ${await res.text()}`);
  }

  // Sanity Assets API 응답 중 사용하는 필드만 단언합니다.
  const { document } = (await res.json()) as { document: { _id: string; url: string } };
  return { assetId: document._id, url: document.url };
}
