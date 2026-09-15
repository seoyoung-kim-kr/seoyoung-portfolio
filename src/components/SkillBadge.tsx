type Props = {
  skill: string;
  /** 시각적 크기 옵션 */
  size?: "sm" | "md";
};

/**
 * 재사용 가능한 스킬/기술 스택 뱃지 컴포넌트입니다.
 * HomePostCard, BlogPostListItem, PostContent, TechStackSection 등에서 사용됩니다.
 */
export default function SkillBadge({ skill, size = "sm" }: Props) {
  if (size === "md") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-muted/25 dark:bg-brand-muted/20 text-brand-dark dark:text-brand-light border border-brand-muted/50 shadow-2xs hover:bg-brand-pink/50 dark:hover:bg-brand-pink/30 hover:border-brand-pink/60 transition-colors cursor-default">
        {skill}
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-muted/25 dark:bg-brand-muted/20 text-brand-dark dark:text-brand-light border border-brand-muted/40 hover:bg-brand-pink/50 dark:hover:bg-brand-pink/30 hover:border-brand-pink/60 transition-colors cursor-default">
      {skill}
    </span>
  );
}
