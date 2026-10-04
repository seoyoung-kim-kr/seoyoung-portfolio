import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/src/features/projects/queries";
import AdminGuard from "@/src/features/admin/AdminGuard";
import ProjectEditor from "@/src/features/admin/ProjectEditor";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AdminEditPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <AdminGuard>
      <ProjectEditor initialProject={project} />
    </AdminGuard>
  );
}
