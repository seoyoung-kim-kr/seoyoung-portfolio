"use client";

import React, { useEffect, useState } from "react";
import Container from "@/src/components/Container";
import { useAdmin } from "@/src/context/AdminContext";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import Link from "next/link";
import { toast } from "sonner";
import { Post } from "@/src/service/posts";

export default function OrderManagePage() {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [projects, setProjects] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/sy-admin");
      return;
    }
    
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, [isAdmin, router]);

  const handleOrderChange = (index: number, newOrder: string) => {
    const parsed = parseInt(newOrder, 10);
    const orderValue = isNaN(parsed) ? 99 : parsed;
    
    setProjects(prev => {
      const newProjects = [...prev];
      newProjects[index] = { ...newProjects[index], order: orderValue };
      return newProjects;
    });
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      const promises = projects.map((p) => {
        return fetch(`/api/posts/${p._id || p.path}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: p.order ?? 99 }),
        });
      });
      await Promise.all(promises);
      toast.success("정렬 순서가 저장되었습니다.");
      
      // 재정렬 후 다시 불러오기
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (e) {
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin || loading) return null;

  return (
    <Container className="py-16 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/sy-admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <FiArrowLeft /> 관리자 홈
        </Link>
        <button
          onClick={saveOrder}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-muted hover:bg-brand-muted-hover text-brand-dark rounded-xl font-bold transition-all disabled:opacity-50"
        >
          <FiSave /> {saving ? "저장 중..." : "순서 저장"}
        </button>
      </div>

      <div className="bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-xl font-bold mb-6 text-brand-dark dark:text-brand-light">
          프로젝트 정렬 순서 관리
        </h1>
        <p className="text-sm text-gray-500 mb-6">낮은 숫자가 먼저 표시됩니다. (기본값: 99)</p>

        <div className="space-y-3">
          {projects.map((p, i) => (
            <div key={p.path || p._id || i} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-brand-dark-base">
              <input 
                type="number" 
                value={p.order ?? 99}
                onChange={(e) => handleOrderChange(i, e.target.value)}
                className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-brand-dark-card text-center focus:outline-brand-muted"
              />
              <div className="flex-1 truncate font-medium text-brand-dark dark:text-brand-light">
                {p.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
