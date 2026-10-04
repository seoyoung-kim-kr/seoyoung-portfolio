# seoyoung-portfolio

프론트엔드 개발자 김서영의 포트폴리오 사이트.
프로젝트 글을 코드 배포 없이 수정할 수 있도록 Sanity를 콘텐츠 저장소로 두고, 사이트 안에 전용 관리자 페이지를 만들어 Studio 없이도 글을 쓰고 고칠 수 있게 구성했습니다.

**Live** — https://portfolio.seoyoung.dev

## Stack

| 영역      | 사용 기술                                                        |
| --------- | ---------------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19, TypeScript                    |
| Styling   | Tailwind CSS v4, `@tailwindcss/typography`                       |
| Content   | Sanity (프로젝트 글 · 기술 스택), `studio/`에 Sanity Studio 포함 |
| Markdown  | react-markdown + remark-gfm + react-syntax-highlighter           |
| Contact   | Nodemailer (Route Handler에서 메일 발송)                         |
| Deploy    | Vercel                                                           |

## 구조

```
app/
  page.tsx                  홈 (About · Skills · Featured Projects · Career)
  projects/                 프로젝트 목록 · 상세 ([slug])
  contact/                  문의 폼
  sy-admin/                 관리자 — 글 작성(write) · 수정(edit/[slug]) · 정렬(order)
  api/
    admin/                  관리자 세션 (login · logout · check)
    posts/                  글 생성 · 정렬 · 수정 · 삭제 → Sanity Mutation API
    upload/                 이미지 업로드 → Sanity Asset
    contact/                문의 메일 발송
src/
  features/                 기능(도메인) 단위 모듈
    projects/               프로젝트 타입 · 조회(queries) · 쓰기(mutations) · 입력 스키마 · 카드/상세 UI
    admin/                  관리자 세션 · Route 래퍼 · 클라이언트 API · 에디터 · 정렬 폼 · 가드
    contact/                문의 폼 · 메일 발송
    home/                   홈 섹션 (Hero, About, TechStack, Experience, ContactCTA)
  shared/                   기능에 속하지 않는 공용 코드
    lib/                    Sanity HTTP 클라이언트 · API 응답 규약/헬퍼
    ui/                     Container, GlassCard, MarkdownViewer …
    layout/                 Header, Footer, ThemeToggle, GlobalBackground
    config/site.ts          사이트 메타 정보
studio/                     Sanity Studio (schemaTypes: post, techStack)
```

## 설계 메모

- **콘텐츠와 코드 분리** — 프로젝트 글, 기술 스택은 전부 Sanity 문서. 글을 고치는 일에 배포가 필요 없도록 했습니다.
- **사이트 내장 관리자** — Sanity Studio를 매번 띄우지 않고도 사이트 안에서 글을 쓰고 고칠 수 있게 `sy-admin`을 두었습니다. 관리자 세션은 httpOnly 쿠키, 쓰기는 서버 Route Handler에서만 Sanity 토큰을 사용합니다. 토큰이 클라이언트에 노출되지 않습니다.
- **ISR** — 읽기 쿼리는 60초 revalidate. 글을 고치면 1분 안에 반영됩니다.
- **본문 이미지** — 관리자 에디터에서 업로드하면 Sanity Asset으로 올라가고, 마크다운 이미지 태그를 돌려받아 본문에 붙여 넣는 흐름입니다.

## 로컬 실행

```bash
# 사이트
npm install
npm run dev          # http://localhost:3000

# Sanity Studio
cd studio
npm install
npm run dev          # http://localhost:3333
```

`.env.local`

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=            # 쓰기용, 서버에서만 사용
ADMIN_PASSWORD=
AUTH_USER= / AUTH_PASS=      # 문의 메일 발송용 계정 정보 (Gmail 앱 비밀번호 등)
```
