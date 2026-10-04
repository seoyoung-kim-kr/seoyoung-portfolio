"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { getErrorMessage } from "@/src/shared/lib/http";
import { DEFAULT_PROJECT_ORDER, type Project } from "@/src/features/projects/types";
import { adminApi } from "./adminApi";

type OrderItem = Pick<Project, "_id" | "title"> & { order: number };

type Props = {
  /** order 순으로 정렬된 전체 프로젝트 */
  projects: Project[];
};

function toOrderItems(projects: Project[]): OrderItem[] {
  return projects.map(({ _id, title, order }) => ({
    _id,
    title,
    order: order ?? DEFAULT_PROJECT_ORDER,
  }));
}

/** 프로젝트 정렬 순서(order) 일괄 편집 폼 */
export default function ProjectOrderForm({ projects }: Props) {
  const [items, setItems] = useState<OrderItem[]>(() => toOrderItems(projects));
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const changeOrder = (id: string, value: string) => {
    const parsed = Number.parseInt(value, 10);
    const order = Number.isNaN(parsed) ? DEFAULT_PROJECT_ORDER : parsed;
    setItems((prev) => prev.map((item) => (item._id === id ? { ...item, order } : item)));
  };

  const saveOrders = async () => {
    setIsSaving(true);
    try {
      await adminApi.saveProjectOrders({
        orders: items.map(({ _id, order }) => ({ id: _id, order })),
      });
      // 저장된 순서대로 목록을 다시 정렬합니다. (sort 는 안정 정렬이라 같은 order 끼리는 기존 순서 유지)
      setItems((prev) => [...prev].sort((a, b) => a.order - b.order));
      toast.success("정렬 순서가 저장되었습니다.");
    } catch (error) {
      toast.error(getErrorMessage(error, "저장 중 오류가 발생했습니다."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/sy-admin"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft /> 관리자 홈
        </Link>
        <button
          type="button"
          onClick={saveOrders}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-muted hover:bg-brand-muted-hover text-brand-dark rounded-xl font-bold transition-all disabled:opacity-50"
        >
          <FiSave /> {isSaving ? "저장 중..." : "순서 저장"}
        </button>
      </div>

      <div className="bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-xl font-bold mb-6 text-brand-dark dark:text-brand-light">
          프로젝트 정렬 순서 관리
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          낮은 숫자가 먼저 표시됩니다. (기본값: {DEFAULT_PROJECT_ORDER})
        </p>

        <ul className="space-y-3">
          {items.map(({ _id, title, order }) => (
            <li
              key={_id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-brand-dark-base"
            >
              <input
                type="number"
                value={order}
                onChange={(e) => changeOrder(_id, e.target.value)}
                aria-label={`${title} 정렬 순서`}
                className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark-card text-center focus:outline-brand-muted"
              />
              <span className="flex-1 truncate font-medium text-brand-dark dark:text-brand-light">
                {title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
