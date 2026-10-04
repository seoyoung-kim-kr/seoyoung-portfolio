# seoyoung-portfolio

프론트엔드 개발자 김서영의 포트폴리오 사이트.
프로젝트 글을 코드 배포 없이 수정할 수 있도록 Sanity를 콘텐츠 저장소로 두고, 사이트 안에 전용 관리자 페이지를 만들어 Studio 없이도 글을 쓰고, 고치고, 정렬할 수 있게 구성했습니다.

**Live** — https://portfolio.seoyoung.dev

## Stack

| 영역       | 사용 기술                                              |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router), React 19, TypeScript          |
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
  page.tsx                  홈 (About · Skills · Featured Projects · Career)
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
    home/                   홈 섹션 (Hero, About, TechStack, Experience, ContactCTA)
  shared/                   기능에 속하지 않는 공용 코드
    lib/                    Sanity HTTP 클라이언트 · API 응답 규약/헬퍼
    ui/                     Container, GlassCard, MarkdownViewer …
    layout/                 Header, Footer, ThemeToggle, GlobalBackground
    config/site.ts          사이트 메타 정보
studio/                     Sanity Studio (schemaTypes: post, techStack — techStack 은 현재 사이트에서 사용하지 않음)
```

## 설계 메모

- **콘텐츠와 코드 분리** — 프로젝트 글은 전부 Sanity 문서라 글을 고치는 일에 배포가 필요 없습니다. 자주 바뀌지 않는 소개·기술 스택·경력은 `src/features/home/` 코드에 둡니다.
- **기능 단위 구조** — 코드는 기능(`features/*`)별로 모으고, 여러 기능이 함께 쓰는 것만 `shared/`에 둡니다. 한 곳에서만 쓰는 작은 컴포넌트는 따로 파일을 만들지 않고 사용처에 둡니다.
- **사이트 내장 관리자** — Sanity Studio를 매번 띄우지 않고도 사이트 안에서 글을 쓰고, 고치고, 정렬할 수 있게 `sy-admin`을 두었습니다.
  - 세션은 `ADMIN_PASSWORD`로 서명한 httpOnly 쿠키입니다(7일). 비밀번호를 바꾸면 기존 세션이 모두 무효화됩니다.
  - 관리자 화면의 가드(`AdminGuard`)는 UX용이고, 실제 권한 검사는 API의 `adminRoute`에서 합니다.
  - 쓰기는 서버 Route Handler에서만 Sanity 토큰을 사용하므로 토큰이 클라이언트에 노출되지 않습니다.
- **API 규약** — 모든 내부 API는 `{ success: true, ...data }` / `{ success: false, message }` 형태로 응답하고, 요청 body는 서버에서 yup 스키마로 검증합니다(400 · 401 · 404 · 500).
- **캐시** — 읽기 쿼리는 60초 ISR입니다. 관리자 화면에서 저장하면 `revalidatePath`로 즉시 반영되고, Studio에서 직접 고친 내용은 1분 안에 반영됩니다.
- **정렬** — 프로젝트는 `order` 오름차순(값이 없으면 99), 같으면 시작일 내림차순으로 노출됩니다. `/sy-admin/order`에서 일괄 수정합니다.
- **이미지** — 썸네일과 본문 이미지는 관리자 에디터에서 Sanity Asset으로 업로드합니다. 본문 이미지는 업로드 후 마크다운 코드를 복사해 본문에 붙여 넣는 흐름입니다.

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
