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
  /** 메인 메뉴 마퀴에 흐르는 이미지. 없으면 틴트 블록이 자리를 지킨다 */
  image?: string;
  /** 기본은 캡슐로 위아래를 잘라낸다. 로고는 잘리면 안 되므로 contain */
  fit?: "cover" | "contain";
}

/**
 * 메인화면 FlowingMenu의 네 갈래.
 * 라벨과 순서를 바꾸려면 여기만 고치면 메뉴와 내부 네비가 동시에 따라간다.
 *
 * GRIT     브랜드 방향성 · 비주얼 · 매니페스토
 * ARCHIVE  CMF가 다른 홀드들의 아카이빙
 * PROCESS  브랜드북 · 제작 과정
 * ABOUT    팀 · 전시
 *
 * 이미지는 `npm run menu-images`로 만든다.
 */
export const destinations: Destination[] = [
  { label: "GRIT", href: "/grit", image: "/img/menu/grit.webp", fit: "contain" },
  { label: "ARCHIVE", href: "/archive", image: "/img/menu/archive.webp" },
  { label: "PROCESS", href: "/process", image: "/img/menu/process.webp" },
  { label: "ABOUT", href: "/about", image: "/img/menu/about.webp" },
];

export const nav = destinations;
