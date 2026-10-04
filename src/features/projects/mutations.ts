import { sanityFetch, sanityMutate } from "@/src/shared/lib/sanity";
import type { ProjectInput, ProjectOrderInput, ProjectPatch } from "./projectInput";
import { DEFAULT_PROJECT_ORDER } from "./types";

/** 프로젝트 문서 쓰기 로직 (서버 전용) */

export class ProjectNotFoundError extends Error {
  constructor(idOrSlug: string) {
    super(`프로젝트를 찾을 수 없습니다: ${idOrSlug}`);
    this.name = "ProjectNotFoundError";
  }
}

// published 문서와 draft 문서를 함께 수정/삭제하기 위해 _id 목록을 조회합니다.
const FIND_PROJECT_IDS_QUERY = `
  *[_type == "post" && (_id in [$id, "drafts." + $id] || slug.current == $id || path == $id)]._id
`;

async function findProjectDocumentIds(idOrSlug: string): Promise<string[]> {
  const ids = await sanityFetch<string[]>(
    FIND_PROJECT_IDS_QUERY,
    { id: idOrSlug },
    { revalidate: false, withToken: true }
  );
  if (ids.length === 0) throw new ProjectNotFoundError(idOrSlug);
  return ids;
}

function toSlugField(slug: string) {
  return { _type: "slug", current: slug };
}

function toImageField(assetId: string) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const suffix = Date.now().toString(36);
  return base ? `${base}-${suffix}` : `project-${suffix}`;
}

export async function createProject(input: ProjectInput): Promise<{ slug: string }> {
  const { slug: inputSlug, assetId, ...fields } = input;
  const slug = inputSlug || generateSlug(fields.title);

  await sanityMutate([
    {
      create: {
        _type: "post",
        ...fields,
        order: fields.order ?? DEFAULT_PROJECT_ORDER,
        featured: fields.featured ?? false,
        startDate: fields.startDate || new Date().toISOString().slice(0, 10),
        slug: toSlugField(slug),
        ...(assetId && { image: toImageField(assetId) }),
      },
    },
  ]);

  return { slug };
}

export async function updateProject(idOrSlug: string, patch: ProjectPatch): Promise<void> {
  const { slug, assetId, ...fields } = patch;
  const ids = await findProjectDocumentIds(idOrSlug);

  // JSON 직렬화 시 undefined 필드는 빠지므로, 전달된 필드만 갱신됩니다.
  const set = {
    ...fields,
    ...(slug && { slug: toSlugField(slug) }),
    ...(assetId && { image: toImageField(assetId) }),
  };

  await sanityMutate(ids.map((id) => ({ patch: { id, set } })));
}

export async function updateProjectOrders({ orders }: ProjectOrderInput): Promise<void> {
  await sanityMutate(orders.map(({ id, order }) => ({ patch: { id, set: { order } } })));
}

export async function deleteProject(idOrSlug: string): Promise<void> {
  const ids = await findProjectDocumentIds(idOrSlug);
  await sanityMutate(ids.map((id) => ({ delete: { id } })));
}
