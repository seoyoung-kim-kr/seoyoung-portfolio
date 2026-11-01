import GlassCard from "@/src/shared/ui/GlassCard";

type Metric = {
  label: string;
  value: string;
};

const METRICS: Metric[] = [
  { label: "레거시 통합", value: "사이트 8개 → 1개" },
  { label: "서비스 규모", value: "29개 페이지 · 평일 약 270명" },
  { label: "공용 위젯", value: "29개 중 24개 페이지" },
  { label: "대용량 폼", value: "최대 1,700행 · 약 5,000칸" },
];

/** 히어로 소개 문구를 뒷받침하는 규모 지표. 설명은 Projects 카드가 맡습니다. */
export default function HighlightsSection() {
  return (
    <GlassCard className="p-5 sm:p-6">
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {METRICS.map(({ label, value }) => (
          <div key={label} className="space-y-1">
            <dt className="text-xs font-bold text-brand-accent dark:text-brand-muted">
              {label}
            </dt>
            <dd className="text-base font-extrabold leading-snug text-brand-dark dark:text-brand-light break-keep">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  );
}
