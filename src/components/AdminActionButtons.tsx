"use client";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useAdmin } from "../context/AdminContext";
import { useDeleteProject } from "../hooks/useDeleteProject";
import { useRouter } from "next/navigation";

type Props = {
  /** 수정 라우팅 및 삭제 API 호출에 사용되는 포스트 슬러그 */
  path: string;
  /** 삭제 모달 등에 표시될 포스트 제목 */
  title: string;
  /** 시각적 옵션 — "floating"은 카드 컴포넌트 우상단 오버레이로 렌더링되며,
   *  "inline"은 상세 페이지 내부의 버튼 행으로 렌더링됩니다. */
  variant?: "floating" | "inline";
  /** 삭제 성공 후 프로젝트 목록 페이지로 리다이렉트 할지 여부 */
  redirectOnDelete?: boolean;
};

/**
 * 관리자 전용 수정 / 삭제 버튼 컴포넌트입니다.
 * HomePostCard, BlogPostListItem, PostContent에서의 3중 중복을 제거하기 위해 추출되었습니다.
 */
export default function AdminActionButtons({
  path,
  title,
  variant = "floating",
  redirectOnDelete = false,
}: Props) {
  const { isAdmin } = useAdmin();
  const { deleteProject, deleting } = useDeleteProject();
  const router = useRouter();

  if (!isAdmin) return null;

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-end gap-2 max-w-3xl mx-auto">
        <button
          onClick={() => router.push(`/sy-admin/edit/${path}`)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-muted/40 hover:bg-brand-muted/70 text-brand-dark dark:text-brand-light text-xs font-bold border border-brand-muted"
        >
          <FiEdit2 className="w-3.5 h-3.5" />
          <span>Edit Project</span>
        </button>
        <button
          onClick={() => deleteProject(path, title, redirectOnDelete)}
          disabled={deleting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold border border-red-300 disabled:opacity-50"
        >
          <FiTrash2 className="w-3.5 h-3.5" />
          <span>Delete Project</span>
        </button>
      </div>
    );
  }

  // "floating" variant — compact pill overlay
  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded-full bg-white/90 dark:bg-brand-dark-base/90 border border-brand-muted/50 shadow-md backdrop-blur-md">
      <button
        onClick={() => router.push(`/sy-admin/edit/${path}`)}
        title="프로젝트 수정"
        className="p-1.5 rounded-full hover:bg-brand-muted/30 text-brand-dark dark:text-brand-light transition-colors"
      >
        <FiEdit2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => deleteProject(path, title)}
        disabled={deleting}
        title="프로젝트 삭제"
        className="p-1.5 rounded-full hover:bg-red-100 text-red-500 transition-colors disabled:opacity-50"
      >
        <FiTrash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
