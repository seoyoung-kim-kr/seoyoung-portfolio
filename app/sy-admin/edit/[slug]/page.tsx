"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import type { Post } from "@/src/service/posts";

const ProjectEditor = dynamic(() => import("@/src/components/ProjectEditor"), {
  ssr: false,
});

export default function AdminEditPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<(Post & { content?: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setPost(json.data);
        } else {
          setError(json.message || "포스트를 불러올 수 없습니다.");
        }
      })
      .catch((err) => setError(err.message || "네트워크 오류"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-muted border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400">포스트 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3 p-8 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm font-bold text-red-600 dark:text-red-400">
            {error || "포스트를 찾을 수 없습니다."}
          </p>
        </div>
      </div>
    );
  }

  return <ProjectEditor initialPost={post} />;
}
