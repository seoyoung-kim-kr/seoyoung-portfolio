"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { getErrorMessage } from "@/src/shared/lib/http";
import { DEFAULT_PROJECT_ORDER, type Project } from "@/src/features/projects/types";
import { adminApi } from "./adminApi";

type OrderItem = Pick<Project, "_id" | "title"> & {
  /**
   * 입력란에 표시되는 값. 입력 도중 빈 값("")을 허용해야 하므로 숫자로 바꾸지 않고 문자열로 보관하며,
   * 저장할 때 parseOrder 로 변환합니다.
   */
  orderInput: string;
};

type Props = {
  /** order 순으로 정렬된 전체 프로젝트 */
  projects: Project[];
};

function toOrderItems(projects: Project[]): OrderItem[] {
  return projects.map(({ _id, title, order }) => ({
    _id,
    title,
    orderInput: String(order ?? DEFAULT_PROJECT_ORDER),
  }));
}

/** 입력값을 정렬 순서로 변환합니다. 비어 있거나 숫자가 아니면 기본값으로 저장합니다. */
function parseOrder(orderInput: string): number {
  const parsed = Number.parseInt(orderInput, 10);
  return Number.isNaN(parsed) ? DEFAULT_PROJECT_ORDER : parsed;
}

/** 프로젝트 정렬 순서(order) 일괄 편집 폼 */
export default function ProjectOrderForm({ projects }: Props) {
  const [items, setItems] = useState<OrderItem[]>(() => toOrderItems(projects));
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const changeOrderInput = (id: string, orderInput: string) => {
    setItems((prev) => prev.map((item) => (item._id === id ? { ...item, orderInput } : item)));
  };

  const saveOrders = async () => {
    setIsSaving(true);
    try {
      const orders: { id: string; order: number }[] = items.map(({ _id, orderInput }) => ({
        id: _id,
        order: parseOrder(orderInput),
      }));
      await adminApi.saveProjectOrders({ orders });

      // 입력란을 실제 저장된 값으로 맞추고, 그 순서대로 다시 정렬합니다.
      // (sort 는 안정 정렬이라 같은 order 끼리는 기존 순서가 유지됩니다.)
      setItems((prev) =>
        prev
          .map((item) => ({ ...item, orderInput: String(parseOrder(item.orderInput)) }))
          .sort((a, b) => Number(a.orderInput) - Number(b.orderInput))
      );
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
          {items.map(({ _id, title, orderInput }) => (
            <li
              key={_id}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-brand-dark-base"
            >
              <input
                type="number"
                value={orderInput}
                onChange={(e) => changeOrderInput(_id, e.target.value)}
                placeholder={String(DEFAULT_PROJECT_ORDER)}
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
