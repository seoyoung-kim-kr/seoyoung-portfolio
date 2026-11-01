import Link from "next/link";
import { FiArrowUpRight, FiAward } from "react-icons/fi";
import GlassCard from "@/src/shared/ui/GlassCard";
import SectionHeader from "@/src/shared/ui/SectionHeader";

type Highlight = {
  label: string;
  /** 카드에서 가장 크게 보이는 규모 · 결과 */
  value: string;
  description: string;
  /** 해당 내용을 자세히 다룬 프로젝트 상세 경로 */
  href: string;
};

const PLATFORM_PROJECT_HREF = "/projects/b2b-react";
const PERMISSION_PROJECT_HREF = "/projects/server-permission-testing";

const HIGHLIGHTS: Highlight[] = [
  {
    label: "레거시 통합",
    value: "사이트 8개 → 플랫폼 1개",
    description:
      "바닐라 JS 레거시 사이트를 React 단일 플랫폼으로 통합하며 FSD 구조와 공용 위젯 체계를 설계했습니다.",
    href: PLATFORM_PROJECT_HREF,
  },
  {
    label: "서비스 규모",
    value: "29개 페이지 · 평일 약 270명",
    description:
      "사내 구성원과 고객사가 평일 일 평균 약 270명 사용하는 플랫폼을 FE 2명 중 1명으로 개발하고 운영합니다.",
    href: PLATFORM_PROJECT_HREF,
  },
  {
    label: "공용 위젯",
    value: "29개 중 24개 페이지",
    description:
      "페이지가 테이블 인스턴스를 주입하는 headless 구조의 공용 목록 위젯을 설계하고 구현했습니다.",
    href: PLATFORM_PROJECT_HREF,
  },
  {
    label: "대용량 폼",
    value: "최대 1,700행 · 약 5,000칸",
    description:
      "스크롤 끊김과 입력 지연을 행 가상화로 개선하고, 화면 밖 행까지 제출 시 전체 검증하도록 구성했습니다.",
    href: PLATFORM_PROJECT_HREF,
  },
  {
    label: "권한 체계",
    value: "FE 중앙화 → 서버 기반 전환",
    description:
      "화면 66곳의 권한 분기를 중앙 룰셋으로 통합한 뒤, 7단계에 걸쳐 서버 권한 API 기반으로 전환했습니다.",
    href: PERMISSION_PROJECT_HREF,
  },
];

export default function HighlightsSection() {
  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<FiAward className="w-5 h-5" />}
        title="Core Experience"
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {HIGHLIGHTS.map(({ label, value, description, href }) => (
          <li key={label} className="flex">
            <GlassCard hoverLift className="group relative w-full p-6 space-y-2">
              <h3 className="text-xs font-bold text-brand-accent dark:text-brand-muted">
                <Link href={href} className="after:absolute after:inset-0">
                  {label}
                </Link>
              </h3>
              <p className="pr-5 text-lg font-extrabold leading-snug text-brand-dark dark:text-brand-light break-keep">
                {value}
              </p>
              <p className="text-sm leading-relaxed text-brand-dark/80 dark:text-brand-light/80 break-keep">
                {description}
              </p>
              <FiArrowUpRight
                aria-hidden="true"
                className="absolute top-5 right-5 w-4 h-4 text-brand-dark/40 dark:text-brand-light/40 group-hover:text-brand-accent dark:group-hover:text-brand-muted transition-colors"
              />
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
