import { FiUser } from "react-icons/fi";
import { SITE_CONFIG } from "../constants/site";
import GlassCard from "./GlassCard";
import SectionHeader from "./SectionHeader";

type InfoItem = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const INFO_ITEMS: InfoItem[] = [
  { label: "Name", value: SITE_CONFIG.author.name },
  {
    label: "Email",
    value: SITE_CONFIG.author.email,
    href: `mailto:${SITE_CONFIG.author.email}`,
  },
  { label: "Education", value: "한신대학교 컴퓨터공학과" },
  {
    label: "GitHub",
    value: "@seoyoung-kim-kr",
    href: SITE_CONFIG.author.github,
    external: true,
  },
];

function InfoRow({ label, value, href, external }: InfoItem) {
  const valueCls =
    "text-[15px] sm:text-base font-medium text-brand-dark dark:text-brand-light break-all";
  const linkCls = `${valueCls} inline-flex hover:text-brand-accent dark:hover:text-brand-muted hover:underline underline-offset-4 transition-colors`;

  return (
    <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[80px_1fr] gap-3 sm:gap-4 items-center">
      <h3 className="text-sm font-bold text-brand-accent dark:text-brand-muted">
        {label}
      </h3>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className={linkCls}
        >
          <span>{value}</span>
        </a>
      ) : (
        <p className={`${valueCls} font-bold break-keep`}>{value}</p>
      )}
    </div>
  );
}

export default function AboutMeSection() {
  const mid = Math.ceil(INFO_ITEMS.length / 2);
  const leftItems = INFO_ITEMS.slice(0, mid);
  const rightItems = INFO_ITEMS.slice(mid);

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6">
      <SectionHeader icon={<FiUser className="w-5 h-5" />} title="About Me" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 rounded-2xl">
        <div className="space-y-3">
          {leftItems.map((item) => (
            <InfoRow key={item.label} {...item} />
          ))}
        </div>
        <div className="space-y-3">
          {rightItems.map((item) => (
            <InfoRow key={item.label} {...item} />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
