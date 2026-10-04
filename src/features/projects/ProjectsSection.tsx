import { getAllProjects } from "./queries";
import ProjectsShowcase from "./ProjectsShowcase";

/** 홈 Projects 섹션. 데이터 조회는 서버에서, 필터 토글은 클라이언트(ProjectsShowcase)에서 처리합니다. */
export default async function ProjectsSection() {
  const projects = await getAllProjects();
  return <ProjectsShowcase projects={projects} />;
}
