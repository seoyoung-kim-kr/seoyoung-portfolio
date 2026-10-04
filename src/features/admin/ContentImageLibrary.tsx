"use client";

import { useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { FiCopy, FiUploadCloud } from "react-icons/fi";
import { getErrorMessage } from "@/src/shared/lib/http";
import { adminApi } from "./adminApi";

type ContentImage = { name: string; url: string };

type Props = {
  /** 기존 본문 마크다운. 이미 삽입된 이미지를 목록에 미리 채워 넣는 데 사용합니다. */
  initialContent?: string;
};

const MARKDOWN_IMAGE_PATTERN = /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g;

/** 마크다운 본문에서 이미지(`![name](url)`)를 URL 기준으로 중복 없이 추출합니다. */
function extractMarkdownImages(markdown: string): ContentImage[] {
  const imagesByUrl = new Map<string, ContentImage>();
  for (const [, name, url] of markdown.matchAll(MARKDOWN_IMAGE_PATTERN)) {
    if (!imagesByUrl.has(url)) imagesByUrl.set(url, { name: name || "image", url });
  }
  return [...imagesByUrl.values()];
}

function toMarkdownImage({ name, url }: ContentImage): string {
  return `![${name}](${url})`;
}

/**
 * 본문 삽입용 이미지 보관함.
 * 이미지를 업로드한 뒤 마크다운 코드를 복사해 본문에 붙여넣는 용도이며, 폼 저장 데이터에는 포함되지 않습니다.
 */
export default function ContentImageLibrary({ initialContent = "" }: Props) {
  const [images, setImages] = useState<ContentImage[]>(() => extractMarkdownImages(initialContent));
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files ?? []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      // 업로드 순서대로 목록에 쌓이도록 순차 처리합니다.
      for (const file of files) {
        const { url } = await adminApi.uploadImage(file);
        // Sanity 는 동일한 파일에 같은 asset URL 을 돌려주므로 중복 추가하지 않습니다.
        setImages((prev) =>
          prev.some((image) => image.url === url) ? prev : [...prev, { name: file.name, url }]
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "본문 이미지 업로드에 실패했습니다."));
    } finally {
      setIsUploading(false);
      // 같은 파일을 다시 선택해도 change 이벤트가 발생하도록 초기화합니다.
      input.value = "";
    }
  };

  const copyMarkdown = async (image: ContentImage) => {
    try {
      await navigator.clipboard.writeText(toMarkdownImage(image));
      toast.success("마크다운이 클립보드에 복사되었습니다.");
    } catch {
      toast.error("클립보드 복사에 실패했습니다.");
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-brand-dark-card/60 border border-brand-muted/30">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <div>
          <p className="text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider">
            본문 삽입용 이미지
          </p>
          <p className="text-xs text-gray-500 mt-1">
            이미지를 업로드하고 마크다운 코드를 복사해서 본문에 붙여넣으세요.
          </p>
        </div>
        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-muted/20 text-brand-dark dark:text-brand-light hover:bg-brand-muted/40 cursor-pointer transition-colors">
          <FiUploadCloud className="w-4 h-4" />
          <span>{isUploading ? "업로드 중..." : "이미지 추가"}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="text-center p-6 border border-dashed border-brand-muted/30 rounded-xl text-xs text-gray-400 bg-gray-50 dark:bg-brand-dark-base">
          등록된 이미지가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {images.map((image) => (
            <div
              key={image.url}
              className="flex items-center gap-3 p-3 border border-brand-muted/20 rounded-xl bg-gray-50 dark:bg-brand-dark-base shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.name}
                className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700 bg-white"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                  {image.name}
                </p>
                <button
                  type="button"
                  onClick={() => copyMarkdown(image)}
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
  );
}
