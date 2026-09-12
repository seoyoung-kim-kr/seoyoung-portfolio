import AdjacentPostCard from "@/src/components/AdjacentPostCard";
import Container from "@/src/components/Container";
import PostContent from "@/src/components/PostContent";
import { getPostData, getAllPosts } from "@/src/service/posts";
import { SITE_CONFIG } from "@/src/constants/site";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostData(slug);
  } catch (e) {
    return notFound();
  }

  if (!post) return notFound();

  const { next, prev } = post;

  return (
    <Container className="py-8 sm:py-12">
      <article className="max-w-4xl mx-auto">
        {/* Post Main Body */}
        <PostContent post={post} />

        {/* Adjacent Navigation */}
        <section className="p-6 sm:p-10 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex flex-col sm:flex-row gap-4">
            {prev && <AdjacentPostCard post={prev} type="prev" />}
            {next && <AdjacentPostCard post={next} type="next" />}
          </div>
        </section>
      </article>
    </Container>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { title, description, image, path } = await getPostData(slug);
    const bannerSrc = image || `/images/posts/${path}.png`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        url: `${SITE_CONFIG.url}/projects/${slug}`,
        images: [
          {
            url: bannerSrc,
            alt: title,
          },
        ],
      },
    };
  } catch (e) {
    return { title: "포스트를 찾을 수 없습니다" };
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.path }));
}
