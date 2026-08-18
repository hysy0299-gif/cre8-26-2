# CRE8 26-2 — 클라이밍 홀드 CMF 프로젝트 웹사이트

Vite MPA + 바닐라 JS. Vercel 정적 배포.

## 기술 스택

| 영역 | 선택 | 메모 |
| --- | --- | --- |
| 번들러 | Vite 7 (`appType: 'mpa'`) | HTML을 자동 탐색해 엔트리로 등록 — 새 페이지는 폴더+`index.html`만 만들면 됨 |
| UI | 바닐라 JS (ESM) + CSS | 프레임워크 없음 |
| 페이지 전환 | View Transitions API | CSS 2줄, JS 0kb. 미지원 브라우저는 일반 이동으로 폴백 |
| 스크롤 연출 | IntersectionObserver 자작 (`src/lib/reveal.js`) | GSAP/ScrollTrigger 대신 |
| 3D | three.js — **홀드 페이지에서만 동적 import** | 나머지 페이지는 three 0kb |
| 배포 | Vercel (`vercel.json`) | `cleanUrls` + 상세페이지 rewrite |

런타임 의존성은 `three` 하나뿐입니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # 빌드 결과 확인
```

## 페이지 구조 (플로우차트 대응)

```
/                    랜딩페이지            index.html
└ /home              메인홈페이지          home/index.html
  ├ /goods           굿즈(가방)/패키징     goods/index.html
  ├ /brand           브랜드소개/브랜딩     brand/index.html
  │                    └ 출발점·네임·로고·볼트 = 한 페이지 안의 4개 챕터(앵커)
  ├ /process         CMF 실험 프로세스/기록 process/index.html
  │                    └ CMF테스트·터치디자이너·레진·아두이노 = 4개 챕터(앵커)
  ├ /holds           메인홀드페이지        holds/index.html
  │ └ /holds/:id     홀드별 인터랙션/키워드/CMF   holds/detail.html
  └ /archive         홀드 아카이빙         archive/index.html
    └ /archive/:id   홀드별 상세페이지     archive/detail.html
```

브랜드 4개 항목과 프로세스 4개 항목은 **별도 페이지 대신 한 페이지 안의 챕터**로 잡았습니다.
스크롤로 쭉 읽히는 편이 이 분량에 맞고, 나중에 분리하고 싶으면 `src/data/holds.js`의 배열을
그대로 두고 HTML만 쪼개면 됩니다.

`:id` 페이지는 **템플릿 하나(`detail.html`) + 데이터**로 돌아갑니다. 홀드가 20개로 늘어도
HTML 파일은 그대로입니다 — `vercel.json`의 rewrite가 `/archive/molten` → `archive/detail.html`로
넘겨주고, 스크립트가 URL 슬러그로 데이터를 찾습니다.

## 폴더

```
src/
├── data/
│   ├── site.js       브랜드명·태그라인·네비 (여기만 바꾸면 사이트 전체 반영)
│   └── holds.js      홀드 / 프로세스 스텝 / 브랜드 챕터 데이터 ★ 콘텐츠는 여기서 관리
├── lib/
│   ├── chrome.js     네비·푸터 주입 + 페이지 부트스트랩
│   ├── dom.js        $, html 템플릿, 슬러그 파싱
│   ├── reveal.js     스크롤 진입 애니메이션
│   └── hold-viewer.js  three.js 3D 뷰어 (동적 import, 이미지 폴백)
├── pages/            페이지별 엔트리 스크립트
└── styles/
    ├── tokens.css    ★ 색·타입·여백·모션 토큰 — 디자인 바꿀 땐 여기부터
    ├── base.css      리셋 + 폰트
    ├── chrome.css    네비/푸터/페이지 전환
    ├── components.css 공용 컴포넌트
    ├── landing.css   랜딩 전용
    └── holds.css     홀드 리스트/상세/뷰어
public/
├── img/              사진 (경로를 데이터 파일에 적어 사용)
├── models/           홀드 .glb
└── fonts/            셀프호스팅 시 woff2
```

## 콘텐츠 채우는 순서

1. `src/data/site.js` — 브랜드명·태그라인 확정값 입력
2. `src/styles/tokens.css` — `--c-accent` 등 브랜드 컬러 교체
3. `public/img/` 에 사진 넣기 → `src/data/holds.js`의 `poster`/`media` 경로 수정
4. 홀드 추가는 `holds` 배열에 객체 하나 추가 (HTML 수정 불필요)
5. 3D는 `.glb`를 `public/models/`에 넣고 홀드의 `model` 값 채우기 — 비워두면 자동으로 이미지 표시

## 배포

Vercel에서 이 저장소를 Import하면 Vite를 자동 감지합니다.
빌드 커맨드 `npm run build`, 출력 디렉터리 `dist`.

## 남은 작업

- [ ] 브랜드명/로고 확정 후 `site.js` + 워드마크 교체
- [ ] Pretendard CDN → `public/fonts/` 셀프호스팅 전환
- [ ] 홀드 사진 촬영 및 `.glb` 추출
- [ ] OG 이미지 / 메타태그 보강
