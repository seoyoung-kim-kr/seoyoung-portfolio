"use client";

import React, { useState, useEffect, useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Post } from "@/src/service/posts";
import { useAdmin } from "@/src/context/AdminContext";
import { useRouter } from "next/navigation";
import MarkdownViewer from "./MarkdownViewer";
import {
  FiArrowLeft,
  FiSave,
  FiSend,
  FiUploadCloud,
  FiImage,
  FiEye,
  FiEdit3,
  FiCopy,
} from "react-icons/fi";

type Props = {
  initialPost?: Post & { content?: string };
};

// Reusable Markdown Editor Component
function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  minRows = 5,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
}) {
  const [mode, setMode] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider">
        {label}
      </label>
      <div className="rounded-2xl border border-brand-muted/30 dark:border-brand-muted/20 overflow-hidden shadow-sm">
        {/* Tab Header */}
        <div className="flex items-center border-b border-brand-muted/30 bg-brand-light/50 dark:bg-brand-dark-card/50">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold transition-colors border-b-2 ${
              mode === "write"
                ? "border-brand-muted text-brand-dark dark:text-brand-light bg-white dark:bg-brand-dark-base"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <FiEdit3 className="w-4 h-4" />
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold transition-colors border-b-2 ${
              mode === "preview"
                ? "border-brand-muted text-brand-dark dark:text-brand-light bg-white dark:bg-brand-dark-base"
                : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <FiEye className="w-4 h-4" />
            <span>Preview</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-brand-dark-base">
          {mode === "write" ? (
            <TextareaAutosize
              minRows={minRows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full p-5 sm:p-6 bg-transparent font-mono text-sm leading-relaxed resize-none overflow-hidden outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 text-brand-dark dark:text-brand-light"
            />
          ) : (
            <div className="p-5 sm:p-6 min-h-[20vh]">
              {value.trim() ? (
                <MarkdownViewer content={value} />
              ) : (
                <p className="text-sm text-gray-400 italic">
                  미리보기할 내용이 없습니다. Write 탭에서 마크다운을
                  작성해주세요.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectEditor({ initialPost }: Props) {
  const isEdit = Boolean(initialPost);
  const { isAdmin } = useAdmin();
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState(initialPost?.title || "");
  const [description, setDescription] = useState(
    initialPost?.description || "",
  );
  const [category, setCategory] = useState(initialPost?.category || "frontend");
  const [featured, setFeatured] = useState(initialPost?.featured || false);
  const [skills, setSkills] = useState(
    initialPost?.skills ? initialPost.skills.join(", ") : "",
  );
  const [demoUrl, setDemoUrl] = useState(initialPost?.demoUrl || "");
  const [githubUrl, setGithubUrl] = useState(initialPost?.githubUrl || "");
  const [company, setCompany] = useState(initialPost?.company || "");
  const [role, setRole] = useState(initialPost?.role || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [startDate, setStartDate] = useState(
    initialPost?.startDate || new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(initialPost?.endDate || "");

  // Thumbnail State
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialPost?.image || "",
  );
  const [assetId, setAssetId] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [contentImages, setContentImages] = useState<
    { url: string; name: string }[]
  >(() => {
    const existing: { url: string; name: string }[] = [];
    if (initialPost?.content) {
      const regex = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(initialPost.content)!) !== null) {
        // Prevent duplicates
        if (!existing.some((img) => img.url === match![2])) {
          existing.push({ name: match![1] || "image", url: match![2] });
        }
      }
    }
    return existing;
  });
  const [uploadingContentImage, setUploadingContentImage] = useState(false);

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  // Track dirty state
  useEffect(() => {
    if (isDirty) {
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [isDirty]);

  const markDirty = useCallback(() => {
    if (!isDirty) setIsDirty(true);
  }, [isDirty]);

  // Redirect non-admin
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAdmin) {
        router.push("/sy-admin");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isAdmin, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "이미지 업로드에 실패했습니다.");
      }

      setAssetId(json.assetId);
      setThumbnailPreview(json.url);
      markDirty();
    } catch (err: any) {
      setErrorMsg(err.message || "이미지 업로드 오류");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleContentImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingContentImage(true);
    setErrorMsg("");

    try {
      const newImages: { url: string; name: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "이미지 업로드에 실패했습니다.");
        }

        newImages.push({ url: json.url, name: file.name });
      }

      setContentImages((prev) => [...prev, ...newImages]);
    } catch (err: any) {
      setErrorMsg(err.message || "본문 이미지 업로드 오류");
    } finally {
      setUploadingContentImage(false);
      // Reset input so the same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !category.trim()) {
      setErrorMsg("제목, 설명, 카테고리는 필수 입력 항목입니다.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    const skillArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: initialPost?.path || undefined,
      description,
      startDate,
      endDate,
      category,
      company,
      featured,
      skills: skillArray,
      demoUrl,
      githubUrl,
      role,
      content,
      assetId: assetId || undefined,
    };

    try {
      const url = isEdit ? `/api/posts/${initialPost?.path}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "요청 처리에 실패했습니다.");
      }

      setIsDirty(false);
      setSuccessMsg(
        isEdit ? "수정이 완료되었습니다!" : "새 포스트가 발행되었습니다!",
      );

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (
      isDirty &&
      !confirm("저장하지 않은 변경사항이 있습니다. 정말 나가시겠어요?")
    ) {
      return;
    }
    router.back();
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-400">
          관리자 권한을 확인하고 있습니다...
        </p>
      </div>
    );
  }

  // Input field base style
  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-brand-dark-card text-sm focus:outline-none focus:border-brand-muted transition-colors";
  const labelCls =
    "block text-xs font-bold mb-1.5 text-brand-dark dark:text-brand-light";

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark-base">
      {/* ─── Sticky Top Bar ─── */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-brand-dark-base/90 backdrop-blur-xl border-b border-brand-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent dark:text-brand-muted hover:text-brand-dark dark:hover:text-brand-light transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">돌아가기</span>
          </button>

          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-[10px] text-amber-500 font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700">
                미저장
              </span>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                "저장 중..."
              ) : isEdit ? (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>수정 완료</span>
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  <span>발행하기</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Editor Area ─── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold animate-fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-semibold animate-fade-in">
            {successMsg}
          </div>
        )}

        {/* ─── 1. Title ─── */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-brand-dark-card/60 border border-brand-muted/30 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider mb-2">
              제목
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                markDirty();
              }}
              placeholder="포스트 제목을 입력하세요..."
              className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-b-2 border-brand-muted/30 focus:border-brand-muted outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 text-brand-dark dark:text-brand-light tracking-tight pb-3 transition-colors"
            />
          </div>
        </div>

        {/* ─── 2. Metadata (Exposed) ─── */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-brand-dark-card/60 border border-brand-muted/30 space-y-6">
          {/* Row 1: Category & Featured */}
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className={labelCls}>카테고리 *</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  markDirty();
                }}
                className={inputCls}
              >
                <option value="frontend">frontend</option>
                <option value="backend">backend</option>
                <option value="javascript">javascript</option>
                <option value="my-story">my-story</option>
                <option value="retrospective">retrospective</option>
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-5">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  markDirty();
                }}
                className="w-4 h-4 accent-brand-muted"
              />
              <span className="text-xs font-bold text-brand-dark dark:text-brand-light">
                ⭐ 대표 프로젝트 (홈 화면 노출)
              </span>
            </label>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelCls}>시작일 (필수)</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  markDirty();
                }}
                className={inputCls}
                required
              />
            </div>
            <div>
              <label className={labelCls}>종료일 (비워두면 '진행중')</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  markDirty();
                }}
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 2: Company, Skills, Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>소속 / 구분</label>
              <input
                type="text"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  markDirty();
                }}
                placeholder="예: 개인 프로젝트"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>기술 스택 (쉼표 구분)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => {
                  setSkills(e.target.value);
                  markDirty();
                }}
                placeholder="React, TypeScript, Next.js"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>역할 / 기여도</label>
              <input
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  markDirty();
                }}
                placeholder="Frontend Lead (80%)"
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 3: URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>GitHub 주소</label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  markDirty();
                }}
                placeholder="https://github.com/..."
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Live Demo 주소</label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => {
                  setDemoUrl(e.target.value);
                  markDirty();
                }}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* ─── 3. Thumbnail Upload ─── */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-brand-dark-card/60 border border-brand-muted/30">
          <label className="block text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider mb-3">
            썸네일 이미지
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-brand-dark-base border border-dashed border-brand-muted/30">
            {thumbnailPreview ? (
              <div className="relative w-36 aspect-[16/10] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={() => setThumbnailPreview("")}
                />
              </div>
            ) : (
              <div className="w-36 aspect-[16/10] rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 shrink-0 border border-gray-200 dark:border-gray-700">
                <FiImage className="w-7 h-7 mb-1" />
                <span className="text-[10px]">이미지 없음</span>
              </div>
            )}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                프로젝트 카드에 표시될 대표 이미지입니다.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-muted text-brand-dark hover:bg-brand-muted-hover cursor-pointer transition-colors shadow-sm">
                <FiUploadCloud className="w-4 h-4" />
                <span>{uploadingImage ? "업로드 중..." : "이미지 선택"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ─── 4. Content Images (본문 이미지) ─── */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-brand-dark-card/60 border border-brand-muted/30">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider">
                본문 삽입용 이미지
              </label>
              <p className="text-xs text-gray-500 mt-1">
                이미지를 업로드하고 마크다운 코드를 복사해서 본문에
                붙여넣으세요.
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-muted/20 text-brand-dark dark:text-brand-light hover:bg-brand-muted/40 cursor-pointer transition-colors">
              <FiUploadCloud className="w-4 h-4" />
              <span>
                {uploadingContentImage ? "업로드 중..." : "이미지 추가"}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleContentImageUpload}
                disabled={uploadingContentImage}
                className="hidden"
              />
            </label>
          </div>

          {contentImages.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-brand-muted/30 rounded-xl text-xs text-gray-400 bg-gray-50 dark:bg-brand-dark-base">
              등록된 이미지가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contentImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 border border-brand-muted/20 rounded-xl bg-gray-50 dark:bg-brand-dark-base shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                      {img.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `![${img.name}](${img.url})`,
                        );
                        alert("마크다운이 클립보드에 복사되었습니다!");
                      }}
                      className="text-[10px] font-bold px-2.5 py-1.5 bg-white dark:bg-brand-dark-card border border-brand-muted/40 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-brand-dark dark:text-brand-light"
                    >
                      <FiCopy className="w-3.5 h-3.5" />
                      마크다운 복사
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 5. Description (요약 설명) ─── */}
        <MarkdownEditor
          label="개요 (요약 설명)"
          value={description}
          onChange={(val) => {
            setDescription(val);
            markDirty();
          }}
          placeholder="프로젝트 개요 및 핵심 설명을 입력하세요...&#10;&#10;홈 화면 카드의 메인 텍스트로 표시되는 부분입니다."
          minRows={5}
        />

        {/* ─── 6. Content (본문 Detail) ─── */}
        <MarkdownEditor
          label="Detail (상세 본문)"
          value={content}
          onChange={(val) => {
            setContent(val);
            markDirty();
          }}
          placeholder="기술 블로그처럼 상세한 문제 해결 과정이나 회고를 작성하세요...&#10;&#10;# 제목&#10;## 소제목&#10;- 리스트&#10;> 인용구&#10;```javascript&#10;// 코드 블록&#10;```"
          minRows={15}
        />
      </div>
    </div>
  );
}
