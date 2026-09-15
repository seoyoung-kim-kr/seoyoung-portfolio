import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description: "프론트엔드 개발자 김서영의 프로젝트입니다.",
};

export default async function ProjectsPage() {
  redirect('/#projects');
}
