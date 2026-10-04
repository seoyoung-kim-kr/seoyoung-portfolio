import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/src/shared/ui/Container";
import { SITE_CONFIG } from "@/src/shared/config/site";
import { getAllProjects, getProjectBySlug, getProjectWithNeighbors } from "@/src/features/projects/queries";
import ProjectDetail from "@/src/features/projects/ProjectDetail";
import AdjacentProjectCard from "@/src/features/projects/AdjacentProjectCard";

type Props = {
  params: Promise<{ slug: string }>;
};

/** 썸네일이 없는 프로젝트의 OG 이미지 (layout 의 기본 OG 이미지와 동일) */
const DEFAULT_OG_IMAGE = "/images/favicon-logo.png";

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectWithNeighbors(slug);

  if (!project) notFound();

  const { prev, next } = project;

  return (
    <Container className="py-8 sm:py-12">
      <article className="max-w-4xl mx-auto">
        <ProjectDetail project={project} />

        <section className="p-6 sm:p-10 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex flex-col sm:flex-row gap-4">
            {prev && <AdjacentProjectCard project={prev} direction="prev" />}
            {next && <AdjacentProjectCard project={next} direction="next" />}
          </div>
        </section>
      </article>
    </Container>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) return { title: "프로젝트를 찾을 수 없습니다" };

  const { title, description, image, path } = project;
  const shareImage: string = image || DEFAULT_OG_IMAGE;

  // openGraph / twitter 는 layout 의 값과 병합되지 않고 통째로 대체되므로 둘 다 지정합니다.
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_CONFIG.url}/projects/${path}`,
      images: [{ url: shareImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.path }));
}
