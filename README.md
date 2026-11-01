# seoyoung-portfolio

프론트엔드 개발자 김서영의 포트폴리오 사이트.
프로젝트 글을 코드 배포 없이 수정할 수 있도록 Sanity를 콘텐츠 저장소로 두고, 사이트 안에 전용 관리자 페이지를 만들어 Studio 없이도 글을 쓰고, 고치고, 정렬할 수 있게 구성했습니다.

**Live** — https://portfolio.seoyoung.dev

> 이 저장소는 개인 프로젝트입니다. 실무 프로젝트의 코드는 비공개이며, 사이트의 프로젝트 글에는 구조와 의사결정 위주로 정리했습니다.

## 주요 기능

- **공개 페이지** — 홈(핵심 경험 · About · Skills · Projects · Career), 프로젝트 상세(마크다운), 문의 폼
- **관리자 페이지** (`/sy-admin`) — 프로젝트 작성 · 수정 · 삭제, 정렬 순서 일괄 저장, 이미지 업로드, 마크다운 Write/Preview 에디터
- **SEO** — 루트 metadata, 상세 페이지 `generateMetadata`, `sitemap.ts`, `robots.ts`
- **다크 모드** — `.dark` 클래스 기반, `<head>` 인라인 스크립트로 첫 페인트 전에 적용

## Stack

| 영역       | 사용 기술                                              |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling    | Tailwind CSS v4, `@tailwindcss/typography`             |
| Content    | Sanity (프로젝트 글), `studio/`에 Sanity Studio 포함   |
| Markdown   | react-markdown + remark-gfm + react-syntax-highlighter |
| Validation | yup (API 요청 body 서버 검증)                          |
| Contact    | Nodemailer (Route Handler에서 메일 발송)               |
| UI 알림    | sonner (toast)                                         |
| Deploy     | Vercel                                                 |

## 구조

```
app/
  page.tsx                  홈 (Core Experience · About · Skills · Projects · Career)
  projects/                 프로젝트 상세 ([slug]) · 목록 경로는 홈 #projects 로 리다이렉트
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
    home/                   홈 섹션 (Hero, Highlights, About, TechStack, Experience, ContactCTA)
  shared/                   기능에 속하지 않는 공용 코드
    lib/                    Sanity HTTP 클라이언트 · API 응답 규약/헬퍼
    ui/                     Container, GlassCard, MarkdownViewer …
    layout/                 Header, Footer, ThemeToggle, GlobalBackground
    config/site.ts          사이트 메타 정보
studio/                     Sanity Studio (schemaTypes: post, techStack — techStack 은 현재 사이트에서 사용하지 않음)
```

## 설계 메모

- **콘텐츠와 코드 분리** — 프로젝트 글은 전부 Sanity 문서라 글을 고치는 일에 배포가 필요 없습니다. 자주 바뀌지 않는 소개 · 기술 스택 · 경력은 `src/features/home/` 코드에 둡니다.
- **기능 단위 구조** — 코드는 기능(`features/*`)별로 모으고, 여러 기능이 함께 쓰는 것만 `shared/`에 둡니다. 한 곳에서만 쓰는 작은 컴포넌트는 따로 파일을 만들지 않고 사용처에 둡니다.
- **API 규약** — 모든 내부 API는 `{ success: true, ...data }` / `{ success: false, message }` 형태로 응답하고, 요청 body는 서버에서 yup 스키마로 검증합니다(400 · 401 · 404 · 500).
- **정렬** — 프로젝트는 `order` 오름차순(값이 없으면 99), 같으면 시작일 내림차순으로 노출됩니다. `/sy-admin/order`에서 일괄 수정합니다.
- **이미지** — 썸네일과 본문 이미지는 관리자 에디터에서 Sanity Asset으로 업로드합니다. 본문 이미지는 업로드 후 마크다운 코드를 복사해 본문에 붙여 넣는 흐름입니다.

## Server / Client Component 분리 기준

- 페이지와 섹션은 기본적으로 Server Component입니다. 데이터 조회는 서버에서 하고 결과를 props로 내립니다(예: `ProjectsSection`).
- 상태 · 이벤트 · 브라우저 API가 필요한 파일에만 `"use client"`를 붙입니다. 예: 프로젝트 필터 토글(`ProjectsShowcase`), 문의 폼, 관리자 에디터 · 가드, 헤더, 테마 토글.
- `src/shared/lib/sanity.ts`는 서버 전용 모듈입니다. 클라이언트 코드(`adminApi.ts`)는 여기서 타입만 가져오고, 내부 API를 호출합니다.

## 캐시 전략

- **정적 생성** — 홈과 프로젝트 상세(`generateStaticParams`)는 빌드 때 정적으로 생성됩니다. 프로젝트 조회는 시간 기반 재검증 없이 캐시되고 `projects` 태그가 붙습니다.
- **저장 시 재검증** — 콘텐츠가 바뀌는 경로는 관리자 페이지뿐이므로, 쓰기 API(`api/posts`)가 저장에 성공하면 `revalidateTag("projects", { expire: 0 })`로 캐시를 즉시 만료시킵니다. 다음 요청부터 새 내용이 보입니다.
  - `updateTag`는 Server Action 전용이라 Route Handler에서 쓸 수 없고, `revalidateTag(tag, "max")`는 stale-while-revalidate라 저장 직후 첫 요청에 이전 내용이 나가므로 `expire: 0`을 씁니다.
  - Studio에서 직접 고친 내용은 자동으로 반영되지 않습니다(관리자 페이지에서 저장하면 반영).

## Sanity 연동

`@sanity/client` 없이 HTTP API를 `fetch`로 직접 호출합니다(`src/shared/lib/sanity.ts`).

| 함수                | 용도                                                       |
| ------------------- | ---------------------------------------------------------- |
| `sanityFetch`       | GROQ 조회. 파라미터는 쿼리 문자열에 넣지 않고 바인딩으로 전달 |
| `sanityMutate`      | 글 생성 · 수정 · 삭제 · 정렬 저장                          |
| `sanityUploadImage` | 이미지 업로드                                              |

공개 조회는 토큰 없이 published 문서만 읽습니다. `withToken` · `noStore`는 쓰기 직전 조회처럼 최신 값이 필요한 경우에만 씁니다.

## 관리자 인증과 토큰 보호

- **로그인** — `ADMIN_PASSWORD`와 비교한 뒤, 같은 값을 키로 만든 HMAC-SHA256 서명을 쿠키에 저장합니다. 비밀번호를 모르면 유효한 쿠키를 만들 수 없고, 비밀번호를 바꾸면 기존 세션은 모두 무효화됩니다.
- **쿠키** — `httpOnly`, `sameSite=lax`, 운영 환경에서 `secure`, 만료 7일입니다.
- **권한 검사 위치** — 화면의 `AdminGuard`는 UX용이고, 실제 검사는 쓰기 API를 감싸는 `adminRoute`에서 합니다(세션이 없으면 401).
- **토큰** — `SANITY_API_TOKEN`은 `NEXT_PUBLIC_` 접두사가 없는 서버 환경변수이고, 이를 읽는 `sanity.ts`는 서버 코드에서만 값으로 import합니다.
- **현재 한계** — 서명 값에 발급 시각이 없어 세션 7일 만료는 쿠키 수명에만 의존하고, 세션을 개별적으로 폐기할 수 없습니다. 로그인 시도 횟수 제한도 없습니다.

## 로컬 실행

```bash
# 사이트
npm install
npm run dev          # http://localhost:3000
npm run build        # 타입 체크 + 프로덕션 빌드
npm run lint

# Sanity Studio
cd studio
npm install
npm run dev          # http://localhost:3333
```

`.env.local`

```
# 필수
SANITY_API_TOKEN=                  # 쓰기용, 서버에서만 사용
ADMIN_PASSWORD=                    # 관리자 로그인 비밀번호 겸 세션 서명 키 (기본값 없음)
AUTH_USER=                         # 문의 메일 발송용 Gmail 계정
AUTH_PASS=                         # Gmail 앱 비밀번호

# 선택 (비워두면 기본값 사용)
NEXT_PUBLIC_SANITY_PROJECT_ID=     # 기본값: 이 사이트의 Sanity 프로젝트
NEXT_PUBLIC_SANITY_DATASET=        # 기본값: production
NEXT_PUBLIC_SANITY_API_VERSION=    # 기본값: 2024-01-01
NEXT_PUBLIC_SITE_URL=              # 기본값: https://portfolio.seoyoung.dev (sitemap · OG URL 에 사용)
```
