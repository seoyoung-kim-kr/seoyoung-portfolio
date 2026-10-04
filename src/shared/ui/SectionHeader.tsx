import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  /** 아이콘 컨테이너의 배경색 토큰 (기본값: "bg-brand-muted/30") */
  iconBg?: string;
};

/**
 * About Me, Career Timeline, Tech Stack 등에서 일관되게 사용되는 섹션 헤더 컴포넌트입니다.
 * 아이콘과 제목이 가로로 배치됩니다.
 */
export default function SectionHeader({
  icon,
  title,
  iconBg = "bg-brand-muted/30",
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`p-2.5 rounded-2xl ${iconBg} text-brand-dark dark:text-brand-light`}
      >
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-dark dark:text-brand-light">
        {title}
      </h2>
    </div>
  );
}
