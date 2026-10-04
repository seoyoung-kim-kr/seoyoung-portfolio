import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** 마우스 오버 시 위로 살짝 뜨는 효과(-translate-y-1) 활성화 여부 */
  hoverLift?: boolean;
};

/**
 * 포트폴리오 전반에 걸쳐 사용되는 글래스모피즘(Glassmorphism) 카드 컴포넌트입니다.
 * 불투명한 유리 질감의 그라데이션, 테두리, 그림자, 배경 블러 토큰을 한 곳에서 관리합니다.
 */
export default function GlassCard({
  children,
  className = "",
  hoverLift = false,
}: Props) {
  return (
    <div
      className={`rounded-3xl bg-linear-to-br from-white/80 to-white/20 dark:from-brand-dark-card/80 dark:to-brand-dark-card/30 border border-white/80 dark:border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_6px_rgba(255,255,255,1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_6px_rgba(255,255,255,0.1)] transition-all hover:bg-white/50 dark:hover:bg-brand-dark-card/50 ${
        hoverLift
          ? "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_2px_6px_rgba(255,255,255,1)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
