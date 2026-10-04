"use client";

import { usePathname } from "next/navigation";

export default function GlobalBackground() {
  const pathname = usePathname();

  // Disable background blobs on project detail pages and admin pages for readability
  const isDetailPage = pathname.startsWith("/projects/");
  const isAdminPage = pathname.startsWith("/sy-admin");

  if (isDetailPage || isAdminPage) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] rounded-full bg-brand-pink/20 dark:bg-brand-pink-dark/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-pink-200/15 dark:bg-brand-pink/10 blur-[120px]" />
    </div>
  );
}
