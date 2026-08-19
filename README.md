# GRIT — 클라이밍 홀드 CMF / 인터랙션 프로젝트 웹

클라이밍 홀드를 스포츠 장비가 아니라 **손이 닿는 tactile interface이자 CMF 실험 오브제**로
다루는 프로젝트의 Brand Website + Project Archive + Digital Exhibition.

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS v4 |
| 배포 | Vercel |

Motion / GSAP / Three.js는 **필요한 인터랙션이 확정된 시점에** 개별 도입한다.
컴포넌트 레퍼런스(21st.dev, React Bits, Motion Primitives, Codrops, Magic UI)는
interaction logic만 참고하고 비주얼 시스템은 프로젝트 기준으로 다시 만든다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Information Architecture

```
/                  LANDING    진입 화면 → 메인화면으로
/home              MAIN       FlowingMenu 네 갈래
/grit              GRIT       브랜드 방향성 · 비주얼 · 매니페스토
/archive           ARCHIVE    CMF가 서로 다른 홀드들의 아카이빙
/archive/[hold]    DETAIL     Object hero → Form → CMF → Surface → Fabrication → Interaction → Experiment → Next
/process           PROCESS    브랜드북 + 제작 과정 (스테이지 8개)
/about             ABOUT      팀 · 전시
```

GRIT은 로고 사용규정 같은 아이덴티티 매뉴얼이 아니라 **이 프로젝트가 무엇을 보는지**를 말하는
페이지다. 매니페스토 → 방향성 3축 → 비주얼 갤러리.

- 랜딩(`/`)과 메인화면(`/home`)은 상단 네비 없이 자기 진입 장치를 갖고, 나머지는 `(site)` 라우트 그룹이 감싼다.
- 목적지 목록은 `src/data/site.ts`의 `destinations` 하나 — 메인 메뉴와 내부 네비가 같은 소스로 돈다.
- 메인화면은 네 갈래가 화면을 가로로 나눠 갖고, 띠에 커서를 올리면 **들어온 모서리 방향에서**
  마퀴가 밀려 나오며 잉크/바탕이 반전된다.
- Detail은 **템플릿 1개 + 데이터 N개**. 홀드가 늘어도 파일은 그대로다.
- Process는 단일 페이지 + 스테이지 앵커(`/process#modeling`). timeline이 아니라 실험 아카이브로 다룬다.
- Detail의 Fabrication은 프로세스 내용을 복제하지 않고 `hold.processRefs`로 `/process#key`에 연결한다.

## 디자인 시스템 (진행 중)

컬러는 `src/app/globals.css`의 `@theme` 한 곳. **팔레트 4색 밖의 색은 쓰지 않는다.**

| 토큰 | 값 | |
| --- | --- | --- |
| `--color-grit-white` | `#F5F5F5` | GRIT WHITE |
| `--color-grit-black` | `#010101` | GRIT BLACK |
| `--color-grit-mid` | `#AEB6BF` | GRIT MID |
| `--color-grit-green` | `#CBD7D4` | GRIT GREEN |

컴포넌트는 팔레트를 직접 쓰지 않고 **역할 토큰**만 참조한다 (`ground` / `ink` / `ink-muted` / `tint`).
바탕을 검정으로 뒤집을 땐 `@theme`의 역할 토큰 네 줄만 바꾸면 사이트 전체가 따라간다.

로고는 `src/components/logo.tsx` — `lockup` / `symbol` / `wordmark` 세 변형.
`currentColor`를 상속하는 인라인 SVG라 배경에 따라 잉크색이 자동으로 맞는다.

### 타이포

Helvetica Neue **Light(300) / Bold(700) / Heavy(900)** 세 단. `next/font/local`로 셀프호스팅한다.

400(Regular)이 없으므로 `body` 기본 굵기는 300이고, **이 세 단 밖의 값은 쓰지 않는다** —
쓰면 브라우저가 굵기를 합성해서 글자가 뭉갠다.

원본 `.otf`는 `fonts/`에 두고 저장소에 올리지 않는다(용량 + 라이선스).
웹에 나가는 건 Latin 서브셋 `src/fonts/*.woff2`뿐이다.

```bash
npm run fonts   # fonts/*.otf → src/fonts/*.woff2  (1477KB → 73KB)
```

### 그리드 · 스케일

12컬럼. 좌우 여백과 거터는 뷰포트를 따라 늘어난다.

| 토큰 | 값 |
| --- | --- |
| `--page-margin` | `clamp(1.25rem, 4vw, 4rem)` |
| `--grid-gutter` | `clamp(0.75rem, 1.5vw, 1.5rem)` |
| `--section-gap` | `clamp(4rem, 10vw, 10rem)` |

`.page-grid`(12컬럼 + 여백), `.page-inset`(여백만) 두 클래스로 쓴다.

타입은 5단 — `text-label` / `text-body` / `text-lead` / `text-title` / `text-display`.
라벨과 디스플레이의 대비를 크게 벌려 두면 오브제 사진이 주인공인 화면에서 UI가 조용해진다.

### 화면 구성

- **`/` 랜딩** — 한 화면 고정. 워드마크를 폭 전체로 눕히고 하단에 Enter.
- **`/home` 메인** — 한 화면 고정, 스크롤 없음. 좌 5칸 휠(왼쪽 full-bleed, 커브가 화면
  가장자리까지 파고든다) / 우 7칸 선택 중인 목적지의 대표 이미지. 768px 아래에선 휠만 남는다.
- **내부 페이지** — `(site)` 레이아웃이 좌우 여백과 `--section-gap` 리듬만 준다.

## 폴더

```
src/
├── app/          라우트 (App Router)
├── components/   컴포넌트
├── data/         site / holds / process — 콘텐츠는 여기서 관리
└── types/        Hold · ProcessStage 모델
```

## 작업 순서

1. Information Architecture ✅
2. Layout ✅
3. Design System — 색·로고·타이포·그리드 완료
4. Component
5. Interaction
6. Page Assembly
7. Polish

사이트를 한 번에 생성하지 않고 위 순서로, 컴포넌트 단위로 진행한다.

## 현재 상태 — 와이어프레임

전 페이지가 **자리표시 단계**다. 사진·본문 없이 "무엇이 어디에 앉는지"만 보인다.

- 사이트 카피는 **영어**.
- 자리표시 블록은 `src/components/wireframe.tsx`의 `<Slot>`. 콘텐츠가 들어오는 순서대로 걷어낸다.
- `src/data/holds.ts`의 홀드 6개는 **레이아웃 확인용 더미**다. 실제 홀드가 나오면 배열만 갈아끼우면
  라우트와 상세 템플릿은 그대로 간다.

**다음 단계에서 필요한 것:** 홀드 실제 개수·스펙·사진, 프로젝트 statement 원문, 팀/전시 정보.
