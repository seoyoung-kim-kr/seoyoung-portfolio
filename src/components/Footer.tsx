import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-brand-muted/30 dark:border-brand-muted/20 py-8 px-4 bg-white/80 dark:bg-brand-dark-base/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-dark/70 dark:text-brand-light/70">
        <p className="font-semibold">
          Copyright © 2026 Seoyoung Kim. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:seoyoung.k.kr@gmail.com"
            className="hover:text-brand-accent dark:hover:text-brand-muted transition-colors"
          >
            seoyoung.k.kr@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
