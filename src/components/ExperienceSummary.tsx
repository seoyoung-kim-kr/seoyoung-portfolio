import React from "react";
import Link from "next/link";
import { FiBriefcase, FiArrowRight, FiCheckCircle } from "react-icons/fi";

type Props = {
  hideAboutLink?: boolean;
};

export const CAREER_TIMELINE = [
  {
    company: "(주)썬더소프트코리아",
    department: "SmartPlatform팀 (System SW 파트)",
    role: "Software Engineer / Frontend Lead",
    period: "2023.01 ~ 현재",
    isCurrent: true,
    highlights: [
      "파편화된 바닐라 JS 레거시 시스템을 React/TS 및 FSD 아키텍처 기반 단일 모던 B2B 웹 플랫폼으로 통합 전환 및 프론트엔드 설계 주도",
      "TanStack 생태계(Query/Table)와 비제어 폼 기반 대용량 회귀 테스트 데이터 캐싱 최적화 및 FastAPI 연동으로 E2E 문제 해결",
    ],
  },
  {
    company: "(주)썬더소프트코리아",
    department: "FR1팀",
    role: "인턴 (Intern)",
    period: "2022.07.01 ~ 2022.12.31",
    isCurrent: false,
    highlights: [
      "Anritsu 및 Keysight 전문 측정 장비를 활용한 이동통신 프로토콜 테스트 수행 및 회귀 테스트 결함 데이터 검증",
    ],
  },
];

export default function ExperienceSummary({ hideAboutLink = false }: Props) {
  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-white/80 to-white/20 dark:from-brand-dark-card/80 dark:to-brand-dark-card/30 border border-white/80 dark:border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.04),inset_0_2px_6px_rgba(255,255,255,1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_6px_rgba(255,255,255,0.1)] transition-all hover:bg-white/50 dark:hover:bg-brand-dark-card/50 space-y-6">
      <div className="flex items-center justify-between border-b border-brand-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-brand-pink/40 text-brand-dark dark:text-brand-light">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-dark dark:text-brand-light">
              Career Timeline
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:-translate-x-1/2 before:w-0.5 before:bg-brand-muted/30">
        {CAREER_TIMELINE.map((item, idx) => (
          <div key={idx} className="relative pl-9 space-y-2">
            {/* Timeline Dot Indicator */}
            <span
              className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 ${
                item.isCurrent
                  ? "bg-brand-pink-dark border-brand-pink ring-4 ring-brand-pink/30"
                  : "bg-brand-muted border-white dark:border-brand-dark-card"
              }`}
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div>
                <h3 className="font-bold text-brand-dark dark:text-brand-light text-base flex items-center gap-2 flex-wrap">
                  <span>{item.company}</span>
                  <span className="text-xs font-semibold text-brand-accent dark:text-brand-muted bg-brand-muted/15 dark:bg-brand-muted/10 px-2.5 py-0.5 rounded-full border border-brand-muted/30">
                    {item.department}
                  </span>
                </h3>
                <p className="text-xs text-brand-dark/70 dark:text-brand-light/70 mt-0.5 font-medium">
                  {item.role}
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-auto shadow-2xs border ${
                  item.isCurrent
                    ? "bg-brand-pink/40 text-brand-dark dark:text-brand-light border-brand-pink"
                    : "bg-brand-muted/20 text-brand-dark/80 dark:text-brand-light/80 border-brand-muted/40"
                }`}
              >
                {item.period}
              </span>
            </div>

            <ul className="space-y-1.5 pt-1">
              {item.highlights.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs sm:text-sm text-brand-dark/80 dark:text-brand-light/80"
                >
                  <FiCheckCircle className="w-3.5 h-3.5 text-brand-accent dark:text-brand-muted shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
