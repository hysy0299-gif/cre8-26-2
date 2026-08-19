/** 사이트 전역 정보 */
export const site = {
  name: "GRIT",
  // 프로젝트 정의 문구는 ABOUT / statement 확정 시 채운다
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
 */
export const destinations: Destination[] = [
  { label: "GRIT", href: "/identity" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "PROCESS", href: "/process" },
  { label: "ABOUT", href: "/about" },
];

export const nav = destinations;
