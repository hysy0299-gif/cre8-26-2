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
}

/**
 * 메인화면 FlowingMenu의 네 갈래.
 * 라벨과 순서를 바꾸려면 여기만 고치면 메뉴와 내부 네비가 동시에 따라간다.
 *
 * GRIT     브랜드 방향성 · 비주얼 · 매니페스토
 * ARCHIVE  CMF가 다른 홀드들의 아카이빙
 * PROCESS  브랜드북 · 제작 과정
 * ABOUT    팀 · 전시
 */
export const destinations: Destination[] = [
  { label: "GRIT", href: "/grit" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "PROCESS", href: "/process" },
  { label: "ABOUT", href: "/about" },
];

export const nav = destinations;
