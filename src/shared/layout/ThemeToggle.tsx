"use client";

import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="p-2 rounded-full bg-brand-muted/20 dark:bg-brand-muted/30 text-brand-dark dark:text-brand-light hover:bg-brand-muted/40 dark:hover:bg-brand-muted/50 transition-all duration-300 active:scale-90 border border-brand-muted/40 shadow-sm cursor-pointer"
    >
      {theme === "dark" ? (
        <FiSun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45 text-brand-pink" />
      ) : (
        <FiMoon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12 text-brand-dark" />
      )}
    </button>
  );
}
