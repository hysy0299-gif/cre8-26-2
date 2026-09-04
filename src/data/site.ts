/** 사이트 전역 정보 */
export const site = {
  name: "GRIT",
  // 매니페스토 원문은 GRIT 페이지 확정 시 채운다
  description: "",
} as const;

/**
 * 섹션 사진 한 장.
 *
 * width/height는 원본 비율을 그대로 들고 다니기 위한 값이다.
 * 메인화면 아코디언이 이 비율로 열린 칸의 폭을 정해서,
 * 펼쳐진 사진이 잘리지도 여백이 생기지도 않게 한다.
 * srcSet은 `npm run section-images`가 굽는 두 벌(1400w / 2600w)이다.
 */
export interface SectionImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

export interface Destination {
  /** 메뉴·네비에 표기되는 라벨 */
  label: string;
  href: string;
  /** 메인화면 아코디언 칸에 깔리는 사진. `npm run section-images`로 만든다 */
  image?: SectionImage;
}

/**
 * 사이트의 네 갈래. 내부 페이지 상단 네비가 이 목록을 그대로 쓴다.
 *
 * GRIT     브랜드 방향성 · 비주얼 · 매니페스토
 * ARCHIVE  CMF가 다른 홀드들의 아카이빙
 * PROCESS  브랜드북 · 제작 과정
 * ABOUT    팀 · 전시
 */
export const destinations: Destination[] = [
  {
    label: "GRIT",
    href: "/grit",
    image: {
      src: "/img/sections/grit-1400-6e8a8f8e.webp",
      srcSet:
        "/img/sections/grit-1400-6e8a8f8e.webp 1400w, /img/sections/grit-2207-1740f769.webp 2207w",
      width: 2207,
      height: 3252,
    },
  },
  {
    label: "ARCHIVE",
    href: "/archive",
    image: {
      src: "/img/sections/archive-1400-cd3190f8.webp",
      srcSet:
        "/img/sections/archive-1400-cd3190f8.webp 1400w, /img/sections/archive-2600-588561da.webp 2600w",
      width: 2600,
      height: 3762,
    },
  },
  {
    label: "PROCESS",
    href: "/process",
    image: {
      src: "/img/sections/process-1400-5e2ced9e.webp",
      srcSet:
        "/img/sections/process-1400-5e2ced9e.webp 1400w, /img/sections/process-2579-21282855.webp 2579w",
      width: 2579,
      height: 3800,
    },
  },
  { label: "ABOUT", href: "/about" },
];

export const nav = destinations;

/**
 * 메인화면(/home)이 세로로 나눠 갖는 세 칸.
 * ABOUT은 메인에서 빼고 내부 페이지 네비로만 간다 — 첫 화면은 세 갈래로 단순하게.
 */
export const mainSections: Destination[] = destinations.filter((d) => d.href !== "/about");
