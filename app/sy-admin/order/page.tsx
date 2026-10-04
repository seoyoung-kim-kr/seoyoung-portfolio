import Container from "@/src/shared/ui/Container";
import { getAllProjects } from "@/src/features/projects/queries";
import AdminGuard from "@/src/features/admin/AdminGuard";
import ProjectOrderForm from "@/src/features/admin/ProjectOrderForm";

export default async function AdminOrderPage() {
  const projects = await getAllProjects();

  return (
    <AdminGuard>
      <Container className="py-16 max-w-2xl mx-auto">
        <ProjectOrderForm projects={projects} />
      </Container>
    </AdminGuard>
  );
}
