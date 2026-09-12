import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { AdminProvider } from "@/src/context/AdminContext";
import GlobalBackground from "@/src/components/GlobalBackground";
import { SITE_CONFIG } from "@/src/constants/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: "김서영 | 프론트엔드 개발자 포트폴리오",
    template: "%s | 김서영 포트폴리오",
  },
  description:
    "프론트엔드 개발자 김서영의 프로젝트 및 기술 포트폴리오입니다. React, Next.js, TypeScript 기반의 웹 개발 프로젝트를 소개합니다.",
  keywords: [
    "김서영",
    "프론트엔드",
    "프론트엔드 개발자",
    "개발자 포트폴리오",
    "김서영 포트폴리오",
    "Seoyoung",
    "React",
    "Next.js",
    "TypeScript",
    "웹 개발자",
  ],
  authors: [{ name: SITE_CONFIG.author.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author.name,
  publisher: SITE_CONFIG.author.name,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Seoyoung | Frontend Developer Portfolio",
    description:
      "프론트엔드 개발자 김서영의 프로젝트 및 기술 포트폴리오입니다.",
    url: SITE_CONFIG.url,
    siteName: "Seoyoung's Portfolio",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/images/favicon-logo.png",
        width: 800,
        height: 600,
        alt: "Seoyoung Portfolio Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Seoyoung | Frontend Developer Portfolio",
    description:
      "프론트엔드 개발자 김서영의 프로젝트 및 기술 포트폴리오입니다.",
    images: ["/images/favicon-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const storedTheme = localStorage.getItem('theme');
                  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col w-full bg-[#FCFCFC] dark:bg-brand-dark-base text-brand-dark dark:text-brand-light transition-colors duration-300 antialiased selection:bg-brand-pink selection:text-brand-dark relative">
        <GlobalBackground />

        <AdminProvider>
          <Header />
          <main className="grow w-full">{children}</main>
          <Footer />
        </AdminProvider>
      </body>
    </html>
  );
}
