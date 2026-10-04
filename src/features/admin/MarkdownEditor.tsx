"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { FiEdit3, FiEye } from "react-icons/fi";
import type { IconType } from "react-icons";
import MarkdownViewer from "@/src/shared/ui/MarkdownViewer";

type Mode = "write" | "preview";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
};

const TABS: { mode: Mode; label: string; Icon: IconType }[] = [
  { mode: "write", label: "Write", Icon: FiEdit3 },
  { mode: "preview", label: "Preview", Icon: FiEye },
];

/** Write / Preview 탭을 가진 마크다운 입력 필드 */
export default function MarkdownEditor({ label, value, onChange, placeholder, minRows = 5 }: Props) {
  const [mode, setMode] = useState<Mode>("write");

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold text-brand-accent dark:text-brand-muted uppercase tracking-wider">
        {label}
      </label>
      <div className="rounded-2xl border border-brand-muted/30 dark:border-brand-muted/20 overflow-hidden shadow-sm">
        <div className="flex items-center border-b border-brand-muted/30 bg-brand-light/50 dark:bg-brand-dark-card/50">
          {TABS.map(({ mode: tabMode, label: tabLabel, Icon }) => (
            <button
              key={tabMode}
              type="button"
              onClick={() => setMode(tabMode)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold transition-colors border-b-2 ${
                mode === tabMode
                  ? "border-brand-muted text-brand-dark dark:text-brand-light bg-white dark:bg-brand-dark-base"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tabLabel}</span>
            </button>
          ))}
        </div>

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
                  미리보기할 내용이 없습니다. Write 탭에서 마크다운을 작성해주세요.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
