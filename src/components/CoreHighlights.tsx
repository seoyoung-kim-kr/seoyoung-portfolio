import React from "react";
import Link from "next/link";
import {
  FiCpu,
  FiZap,
  FiCheckCircle,
  FiArrowRight,
  FiAward,
} from "react-icons/fi";

type Props = {
  hideAboutLink?: boolean;
};

const HIGHLIGHT_CARDS = [
  {
    icon: FiCpu,
    tag: "Legacy to Modern",
    title: "아키텍처 통합 및 모던화",
    description:
      "파편화된 바닐라 JS 레거시를 React, TypeScript 및 FSD 아키텍처 기반의 단일 모던 웹 플랫폼으로 성공적으로 통합 전환했습니다.",
    accentColor: "bg-brand-pink/40 text-brand-pink-dark border-brand-pink",
  },
  {
    icon: FiZap,
    tag: "B2B Complex State",
    title: "대용량 상태 관리 & 최적화",
    description:
      "TanStack 생태계(Query/Table)와 React Hook Form 비제어 폼을 도입하여 복잡한 B2B 회귀 테스트 데이터의 캐싱과 렌더링 성능을 최적화했습니다.",
    accentColor:
      "bg-brand-muted/40 text-brand-accent dark:text-brand-muted border-brand-muted",
  },
  {
    icon: FiCheckCircle,
    tag: "Full-Stack Problem Solving",
    title: "E2E 비즈니스 문제 해결",
    description:
      "단순 화면 개발을 넘어 고객 VOC 분석부터 FastAPI 백엔드 엔드포인트 연동까지 파고들어 전 과정에서 비즈니스 가치를 창출했습니다.",
    accentColor:
      "bg-brand-muted-alt/30 text-brand-dark dark:text-brand-light border-brand-muted-alt",
  },
];

export default function CoreHighlights({ hideAboutLink = false }: Props) {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-muted/20 text-brand-accent dark:text-brand-muted text-xs font-extrabold border border-brand-muted/30">
            <FiAward className="w-3.5 h-3.5" />
            <span>Key Strengths</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light">
            Core Engineering Highlights
          </h2>
        </div>
      </div>

      {/* 3-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {HIGHLIGHT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="group relative p-6 rounded-3xl bg-white/80 dark:bg-brand-dark-card/80 border border-brand-muted/30 dark:border-brand-muted/20 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-2xl border shadow-2xs ${card.accentColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-brand-muted/15 dark:bg-brand-muted/10 text-brand-dark/70 dark:text-brand-light/70 border border-brand-muted/30">
                    {card.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-dark dark:text-brand-light group-hover:text-brand-accent dark:group-hover:text-brand-muted transition-colors">
                  {card.title}
                </h3>

                <p className="text-xs sm:text-sm text-brand-dark/75 dark:text-brand-light/75 leading-relaxed font-normal">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Link to About Page (Hidden on About Page) */}
      {!hideAboutLink && (
        <div className="flex justify-end pt-1">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-accent dark:text-brand-muted hover:underline"
          >
            <span>자세한 이력 및 경력 사항 보기 (About)</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
