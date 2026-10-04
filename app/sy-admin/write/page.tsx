import AdminGuard from "@/src/features/admin/AdminGuard";
import ProjectEditor from "@/src/features/admin/ProjectEditor";

export default function AdminWritePage() {
  return (
    <AdminGuard>
      <ProjectEditor />
    </AdminGuard>
  );
}
