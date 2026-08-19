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
/home              MAIN       로고타입 + OptionWheel 목적지 휠 (허브)
/identity          IDENTITY   로고타입 / 로고 / 아이덴티티 시스템
/archive           ARCHIVE    홀드 탐색 그리드 (product grid 아님 — 샘플 인덱스)
/archive/[hold]    DETAIL     Object hero → Form → CMF → Surface → Fabrication → Interaction → Experiment → Next
/process           PROCESS    Research → Form Exploration → Modeling → 3D Printing → Mold → Casting/CMF → Sensor → Exhibition
/visual            VISUAL     비주얼 아카이브 / 전시 기록
/about             ABOUT      Definition / Team / Exhibition
```

- 랜딩(`/`)과 메인화면(`/home`)은 상단 네비 없이 자기 진입 장치를 갖고, 나머지는 `(site)` 라우트 그룹이 감싼다.
- 목적지 목록은 `src/data/site.ts`의 `destinations` 하나 — 휠과 네비가 같은 소스로 돈다.
- 메인화면 휠은 **스크롤/드래그로 고르고, 가운데 항목 클릭 또는 Enter로 확정**해야 이동한다.
  지나가는 항목마다 라우팅하면 안 되므로 통과 시엔 prefetch만 한다.
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

**미정:** 타입 스케일·간격 스케일.

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
2. Layout
3. Design System
4. Component
5. Interaction
6. Page Assembly
7. Polish

사이트를 한 번에 생성하지 않고 위 순서로, 컴포넌트 단위로 진행한다.

## 현재 상태

라우트 골격 + 콘텐츠 모델 + 메인화면 OptionWheel 네비게이션까지.
각 페이지는 블록 구획만 있고 비어 있다.
색·타이포·간격 등 디자인 토큰은 3단계에서 정의한다 — 휠에 들어간 색값도 그때까지 임시값이다.
