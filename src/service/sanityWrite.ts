import { SANITY_CONFIG, getSanityMutateUrl, getSanityApiUrl } from "./sanityConfig";

export type CreatePostInput = {
  title: string;
  slug?: string;
  description: string;
  startDate?: string;
  endDate?: string;
  category: string;
  company?: string;
  featured?: boolean;
  skills?: string[];
  demoUrl?: string;
  githubUrl?: string;
  role?: string;
  content?: string;
  assetId?: string;
  imageUrl?: string;
};

async function sanityMutate(mutations: any[]) {
  if (!SANITY_CONFIG.token) {
    throw new Error("SANITY_API_TOKEN is missing in environment variables.");
  }

  const url = getSanityMutateUrl();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SANITY_CONFIG.token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Sanity Mutation Error (${res.status}): ${errorText}`);
  }

  return await res.json();
}

export async function createSanityPost(input: CreatePostInput) {
  const baseSlug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/(^-|-$)+/g, "");
    
  const slugValue =
    input.slug ||
    (baseSlug ? `${baseSlug}-${Date.now().toString(36)}` : `post-${Date.now()}`);

  const doc: Record<string, any> = {
    _type: "post",
    title: input.title,
    slug: { _type: "slug", current: slugValue },
    path: slugValue,
    description: input.description,
    startDate: input.startDate || new Date().toISOString().split("T")[0],
    endDate: input.endDate || "",
    category: input.category || "frontend",
    company: input.company || "",
    featured: Boolean(input.featured),
    skills: input.skills || [],
    demoUrl: input.demoUrl || "",
    githubUrl: input.githubUrl || "",
    role: input.role || "",
    content: input.content || "",
  };

  if (input.assetId) {
    doc.image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: input.assetId,
      },
    };
  }

  return await sanityMutate([{ create: doc }]);
}

export async function updateSanityPost(idOrSlug: string, input: Partial<CreatePostInput>) {
  let targetIds: string[] = [];

  // 1. Query Sanity to find all matching _ids for this slug/path/_id
  try {
    const queryUrl = getSanityApiUrl(
      `*[_type == "post" && (path == "${idOrSlug}" || slug.current == "${idOrSlug}" || _id == "${idOrSlug}" || _id == "drafts.${idOrSlug}")]._id`
    );
    const qRes = await fetch(queryUrl);
    if (qRes.ok) {
      const qJson = await qRes.json();
      if (Array.isArray(qJson.result) && qJson.result.length > 0) {
        targetIds = qJson.result;
      }
    }
  } catch (err) {
    console.error("Sanity query error:", err);
  }

  // 2. Prepare patch object
  const setPatch: Record<string, any> = {};
  if (input.title !== undefined) setPatch.title = input.title;
  if (input.description !== undefined) setPatch.description = input.description;
  if (input.category !== undefined) setPatch.category = input.category;
  if (input.company !== undefined) setPatch.company = input.company;
  if (input.startDate !== undefined) setPatch.startDate = input.startDate;
  if (input.endDate !== undefined) setPatch.endDate = input.endDate;
  if (input.featured !== undefined) setPatch.featured = Boolean(input.featured);
  if (input.skills !== undefined) setPatch.skills = input.skills;
  if (input.demoUrl !== undefined) setPatch.demoUrl = input.demoUrl;
  if (input.githubUrl !== undefined) setPatch.githubUrl = input.githubUrl;
  if (input.role !== undefined) setPatch.role = input.role;
  if (input.content !== undefined) setPatch.content = input.content;

  if (input.assetId) {
    setPatch.image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: input.assetId,
      },
    };
  }

  if (input.slug) {
    setPatch.slug = { _type: "slug", current: input.slug };
    setPatch.path = input.slug;
  }

  // 3. If targetIds is empty (document does not exist in Sanity yet), create it!
  if (targetIds.length === 0) {
    return await createSanityPost({
      title: input.title || idOrSlug,
      slug: input.slug || idOrSlug,
      description: input.description || "",
      category: input.category || "frontend",
      startDate: input.startDate,
      endDate: input.endDate,
      company: input.company,
      featured: input.featured,
      skills: input.skills,
      demoUrl: input.demoUrl,
      githubUrl: input.githubUrl,
      role: input.role,
      content: input.content,
      assetId: input.assetId,
    });
  }

  // 4. Create patch mutation ONLY for document IDs that actually exist in Sanity
  const mutations = targetIds.map((id) => ({
    patch: {
      id,
      set: setPatch,
    },
  }));

  return await sanityMutate(mutations);
}

export async function deleteSanityPost(idOrSlug: string) {
  let targetIds: string[] = [idOrSlug];
  try {
    const queryUrl = getSanityApiUrl(
      `*[_type == "post" && (path == "${idOrSlug}" || slug.current == "${idOrSlug}" || _id == "${idOrSlug}" || _id == "drafts.${idOrSlug}")]._id`
    );
    const qRes = await fetch(queryUrl);
    if (qRes.ok) {
      const qJson = await qRes.json();
      if (Array.isArray(qJson.result) && qJson.result.length > 0) {
        targetIds = qJson.result;
      }
    }
  } catch (_) {}

  const mutations = targetIds.map((id) => ({
    delete: { id },
  }));

  return await sanityMutate(mutations);
}
