"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";
import {
  FiMenu,
  FiX,
  FiUser,
  FiCode,
  FiLayers,
  FiBriefcase,
  FiChevronRight,
} from "react-icons/fi";

type Menu = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const MENU_LIST: Menu[] = [
  { label: "About", href: "/#about", icon: <FiUser className="w-4 h-4" /> },
  { label: "Skills", href: "/#skills", icon: <FiCode className="w-4 h-4" /> },
  {
    label: "Projects",
    href: "/#projects",
    icon: <FiLayers className="w-4 h-4" />,
  },
  {
    label: "Career",
    href: "/#career",
    icon: <FiBriefcase className="w-4 h-4" />,
  },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-brand-dark-base/90 border-b border-brand-muted/30 dark:border-brand-muted/20 transition-colors duration-300">
      <Container className="py-3 sm:py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <Image
            src="/images/favicon-logo.png"
            alt="Seoyoung Portfolio Logo"
            width={32}
            height={32}
            className="group-hover:scale-105 transition-transform duration-300 object-contain w-7 h-7 sm:w-8 sm:h-8"
          />
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-brand-dark dark:text-brand-light group-hover:text-brand-accent transition-colors">
            Seoyoung<span className="text-brand-pink">.</span>
          </h1>
        </Link>

        {/* Desktop Navigation (sm and larger) */}
        <div className="hidden sm:flex items-center gap-3">
          <nav>
            <ul className="flex items-center gap-1.5">
              {MENU_LIST.map((menu) => {
                const isActive =
                  pathname === menu.href ||
                  (menu.href !== "/" && pathname.startsWith(menu.href));
                return (
                  <li key={menu.href}>
                    <Link
                      href={menu.href}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 block ${
                        isActive && pathname === "/" // active 상태 처리를 해시 링크에 맞게 변경할 수 있으나, SPA 스크롤 스파이가 필요하므로 일단 스타일만 유지
                          ? "text-brand-dark/80 dark:text-brand-light/80 hover:text-brand-dark dark:hover:text-white hover:bg-brand-muted/20 dark:hover:bg-brand-muted/20"
                          : "text-brand-dark/80 dark:text-brand-light/80 hover:text-brand-dark dark:hover:text-white hover:bg-brand-muted/20 dark:hover:bg-brand-muted/20"
                      }`}
                    >
                      {menu.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="w-px h-5 bg-brand-muted/30 dark:bg-brand-muted/20" />
          <ThemeToggle />
        </div>

        {/* Mobile Navigation Toggle (sm and smaller) */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-brand-muted/20 text-brand-dark dark:text-brand-light hover:bg-brand-muted/40 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="w-5 h-5 text-brand-pink-dark" />
            ) : (
              <FiMenu className="w-5 h-5 text-brand-dark dark:text-brand-light" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-brand-muted/20 bg-white/95 dark:bg-brand-dark-base/95 backdrop-blur-2xl shadow-xl animate-fade-in">
          <nav className="p-4 space-y-1.5">
            {MENU_LIST.map((menu) => {
              const isActive =
                pathname === menu.href ||
                (menu.href !== "/" && pathname.startsWith(menu.href));
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 rounded-2xl text-sm font-bold transition-all duration-200 text-brand-dark/80 dark:text-brand-light/80 hover:bg-brand-muted/20 dark:hover:bg-brand-muted/10`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-brand-muted-alt">{menu.icon}</span>
                    <span>{menu.label}</span>
                  </div>
                  <FiChevronRight className="w-4 h-4 opacity-50" />
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
