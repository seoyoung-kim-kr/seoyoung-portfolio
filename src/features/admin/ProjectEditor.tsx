"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiArrowLeft, FiImage, FiSave, FiSend, FiUploadCloud } from "react-icons/fi";
import { getErrorMessage } from "@/src/shared/lib/http";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/src/features/projects/types";
import type { ProjectInput } from "@/src/features/projects/projectInput";
import { adminApi } from "./adminApi";
import MarkdownEditor from "./MarkdownEditor";
import ContentImageLibrary from "./ContentImageLibrary";

type Props = {
  /** 수정 모드에서 편집할 프로젝트. 없으면 새 프로젝트 작성 모드입니다. */
  initialProject?: Project;
};

/** 에디터 입력 상태. 모든 입력을 controlled input 으로 다루기 위해 빈 값은 ""로 보관합니다. */
type ProjectForm = {
  title: string;
  description: string;
  category: ProjectCategory;
  featured: boolean;
  /** 쉼표로 구분된 기술 스택 입력값 (예: "React, TypeScript") */
  skills: string;
  company: string;
  role: string;
  demoUrl: string;
  githubUrl: string;
  content: string;
  /** YYYY-MM-DD */
  startDate: string;
  /** YYYY-MM-DD. 비우면 진행 중으로 표시됩니다. */
  endDate: string;
};

type Thumbnail = {
  /** 미리보기 이미지 URL */
  previewUrl: string;
  /** 이번 편집에서 새로 업로드한 asset id. 없으면 기존 썸네일을 유지합니다. */
  assetId?: string;
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function toForm(project?: Project): ProjectForm {
  return {
    title: project?.title ?? "",
    description: project?.description ?? "",
    category: project?.category ?? "frontend",
    featured: project?.featured ?? false,
    skills: project?.skills?.join(", ") ?? "",
    company: project?.company ?? "",
    role: project?.role ?? "",
    demoUrl: project?.demoUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    content: project?.content ?? "",
    startDate: project?.startDate ?? today(),
    endDate: project?.endDate ?? "",
  };
}

function toProjectInput(form: ProjectForm, slug?: string, assetId?: string): ProjectInput {
  return {
    ...form,
    skills: form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    slug,
    assetId,
  };
}

const INPUT_CLASS =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-brand-dark-card text-sm focus:outline-none focus:border-brand-muted transition-colors";
const LABEL_CLASS = "block text-xs font-bold mb-1.5 text-brand-dark dark:text-brand-light";
const SECTION_CLASS =
  "p-5 sm:p-6 rounded-2xl bg-white dark:bg-brand-dark-card/60 border border-brand-muted/30";

type TextFieldProps = {
  label: string;
  type?: "text" | "url" | "date";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function TextField({ label, type = "text", value, onChange, placeholder }: TextFieldProps) {
  return (
    <label className="block">
      <span className={LABEL_CLASS}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </label>
  );
}

/** 프로젝트 작성 / 수정 에디터 */
export default function ProjectEditor({ initialProject }: Props) {
  const isEdit = initialProject !== undefined;
  const router = useRouter();

  const [form, setForm] = useState<ProjectForm>(() => toForm(initialProject));
  const [thumbnail, setThumbnail] = useState<Thumbnail>({ previewUrl: initialProject?.image ?? "" });
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // 저장하지 않은 변경사항이 있으면 새로고침 / 탭 닫기 전에 브라우저 확인창을 띄웁니다.
  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const updateField = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleThumbnailUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    try {
      const { assetId, url } = await adminApi.uploadImage(file);
      setThumbnail({ previewUrl: url, assetId });
      setIsDirty(true);
    } catch (error) {
      toast.error(getErrorMessage(error, "썸네일 업로드에 실패했습니다."));
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("제목과 개요는 필수 입력 항목입니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      const input = toProjectInput(form, initialProject?.path, thumbnail.assetId);
      if (isEdit) {
        await adminApi.updateProject(initialProject._id, input);
      } else {
        await adminApi.createProject(input);
      }

      setIsDirty(false);
      toast.success(isEdit ? "수정이 완료되었습니다." : "새 프로젝트가 발행되었습니다.");
      router.push("/");
      router.refresh();
    } catch (error) {
      // 서버 검증 에러는 여러 줄로 내려오므로 줄바꿈을 유지해서 보여줍니다.
      toast.error(getErrorMessage(error, "저장에 실패했습니다."), {
        style: { whiteSpace: "pre-line" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (isDirty && !confirm("저장하지 않은 변경사항이 있습니다. 정말 나가시겠어요?")) return;
    router.back();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark-base">
      {/* ─── Sticky Top Bar ─── */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-brand-dark-base/90 backdrop-blur-xl border-b border-brand-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
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
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isUploadingThumbnail}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-muted hover:bg-brand-muted-hover text-brand-dark text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
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
        {/* 1. Title */}
        <div className={SECTION_CLASS}>
          <label className="block text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider mb-2">
            제목
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="프로젝트 제목을 입력하세요..."
            className="w-full text-2xl sm:text-3xl font-extrabold bg-transparent border-b-2 border-brand-muted/30 focus:border-brand-muted outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 text-brand-dark dark:text-brand-light tracking-tight pb-3 transition-colors"
          />
        </div>

        {/* 2. Metadata */}
        <div className={`${SECTION_CLASS} space-y-6`}>
          <div className="flex flex-wrap items-center gap-4">
            <label className="block">
              <span className={LABEL_CLASS}>카테고리 *</span>
              <select
                value={form.category}
                // option 이 PROJECT_CATEGORIES 로만 렌더링되므로 선택값은 항상 ProjectCategory 입니다.
                onChange={(e) => updateField("category", e.target.value as ProjectCategory)}
                className={INPUT_CLASS}
              >
                {PROJECT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 cursor-pointer pt-5">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="w-4 h-4 accent-brand-muted"
              />
              <span className="text-xs font-bold text-brand-dark dark:text-brand-light">
                ⭐ 대표 프로젝트 (홈 화면 노출)
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="시작일"
              type="date"
              value={form.startDate}
              onChange={(value) => updateField("startDate", value)}
            />
            <TextField
              label="종료일 (비워두면 '진행 중')"
              type="date"
              value={form.endDate}
              onChange={(value) => updateField("endDate", value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TextField
              label="소속 / 구분"
              value={form.company}
              onChange={(value) => updateField("company", value)}
              placeholder="예: 개인 프로젝트"
            />
            <TextField
              label="기술 스택 (쉼표 구분)"
              value={form.skills}
              onChange={(value) => updateField("skills", value)}
              placeholder="React, TypeScript, Next.js"
            />
            <TextField
              label="역할 / 기여도"
              value={form.role}
              onChange={(value) => updateField("role", value)}
              placeholder="Frontend Lead (80%)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="GitHub 주소"
              type="url"
              value={form.githubUrl}
              onChange={(value) => updateField("githubUrl", value)}
              placeholder="https://github.com/..."
            />
            <TextField
              label="Live Demo 주소"
              type="url"
              value={form.demoUrl}
              onChange={(value) => updateField("demoUrl", value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* 3. Thumbnail */}
        <div className={SECTION_CLASS}>
          <p className="text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider mb-3">
            썸네일 이미지
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-brand-dark-base border border-dashed border-brand-muted/30">
            {thumbnail.previewUrl ? (
              <div className="relative w-36 aspect-16/10 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbnail.previewUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  onError={() => setThumbnail((prev) => ({ ...prev, previewUrl: "" }))}
                />
              </div>
            ) : (
              <div className="w-36 aspect-16/10 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center text-gray-400 shrink-0 border border-gray-200 dark:border-gray-700">
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
                <span>{isUploadingThumbnail ? "업로드 중..." : "이미지 선택"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  disabled={isUploadingThumbnail}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 4. Content Images */}
        <ContentImageLibrary initialContent={initialProject?.content} />

        {/* 5. Description */}
        <MarkdownEditor
          label="개요 (요약 설명)"
          value={form.description}
          onChange={(value) => updateField("description", value)}
          placeholder={"프로젝트 개요 및 핵심 설명을 입력하세요...\n\n홈 화면 카드의 메인 텍스트로 표시되는 부분입니다."}
          minRows={5}
        />

        {/* 6. Content */}
        <MarkdownEditor
          label="Detail (상세 본문)"
          value={form.content}
          onChange={(value) => updateField("content", value)}
          placeholder={
            "기술 블로그처럼 상세한 문제 해결 과정이나 회고를 작성하세요...\n\n# 제목\n## 소제목\n- 리스트\n> 인용구\n```javascript\n// 코드 블록\n```"
          }
          minRows={15}
        />
      </div>
    </div>
  );
}
