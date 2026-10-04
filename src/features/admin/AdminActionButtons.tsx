"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { getErrorMessage } from "@/src/shared/lib/http";
import { useAdmin } from "./AdminContext";
import { adminApi } from "./adminApi";

type Props = {
  /** 수정 라우팅 및 삭제 API 호출에 사용되는 프로젝트 슬러그 */
  path: string;
  /** 삭제 확인창에 표시될 프로젝트 제목 */
  title: string;
  /** "floating": 카드 우상단 오버레이 / "inline": 상세 페이지 상단 버튼 행 */
  variant?: "floating" | "inline";
  /** 삭제 성공 후 홈으로 이동할지 여부 (상세 페이지에서 사용) */
  redirectOnDelete?: boolean;
};

function useDeleteProject() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteProject = async (path: string, title: string, redirect: boolean) => {
    if (!confirm(`정말로 "${title}" 프로젝트를 삭제하시겠습니까?`)) return;

    setIsDeleting(true);
    try {
      await adminApi.deleteProject(path);
      toast.success("프로젝트가 삭제되었습니다.");
      if (redirect) router.replace("/");
      router.refresh();
    } catch (error) {
      toast.error(`삭제 오류: ${getErrorMessage(error, "삭제에 실패했습니다.")}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteProject, isDeleting };
}

/** 관리자에게만 보이는 프로젝트 수정 / 삭제 버튼 */
export default function AdminActionButtons({
  path,
  title,
  variant = "floating",
  redirectOnDelete = false,
}: Props) {
  const { isAdmin } = useAdmin();
  const { deleteProject, isDeleting } = useDeleteProject();

  if (!isAdmin) return null;

  const editHref = `/sy-admin/edit/${path}`;
  const handleDelete = () => deleteProject(path, title, redirectOnDelete);

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-end gap-2 max-w-3xl mx-auto">
        <Link
          href={editHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-muted/40 hover:bg-brand-muted/70 text-brand-dark dark:text-brand-light text-xs font-bold border border-brand-muted"
        >
          <FiEdit2 className="w-3.5 h-3.5" />
          <span>Edit Project</span>
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold border border-red-300 disabled:opacity-50"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          <span>Delete Project</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/90 dark:bg-brand-dark-base/90 border border-brand-muted/50 shadow-md backdrop-blur-md">
      <Link
        href={editHref}
        title="프로젝트 수정"
        aria-label={`${title} 수정`}
        className="p-1.5 rounded-full hover:bg-brand-muted/30 text-brand-dark dark:text-brand-light transition-colors"
      >
        <FiEdit2 className="w-3.5 h-3.5" />
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        title="프로젝트 삭제"
        aria-label={`${title} 삭제`}
        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors disabled:opacity-50"
      >
        <FiTrash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
