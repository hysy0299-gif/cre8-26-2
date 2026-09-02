/** 사이트 전역 정보 */
export const site = {
  name: "GRIT",
  // 매니페스토 원문은 GRIT 페이지 확정 시 채운다
  description: "",
} as const;

export interface Destination {
  /** 메뉴·네비에 표기되는 라벨 */
  label: string;
  href: string;
  /** 메인화면 아코디언 칸에 깔리는 이미지. `npm run section-images`로 만든다 */
  image?: string;
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
  { label: "GRIT", href: "/grit", image: "/img/sections/grit-422f8583.webp" },
  { label: "ARCHIVE", href: "/archive", image: "/img/sections/archive-3348da8c.webp" },
  { label: "PROCESS", href: "/process", image: "/img/sections/process-03885a6d.webp" },
  { label: "ABOUT", href: "/about" },
];

export const nav = destinations;

/**
 * 메인화면(/home)이 세로로 나눠 갖는 세 칸.
 * ABOUT은 메인에서 빼고 내부 페이지 네비로만 간다 — 첫 화면은 세 갈래로 단순하게.
 */
export const mainSections: Destination[] = destinations.filter((d) => d.href !== "/about");
