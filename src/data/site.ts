/** 사이트 전역 정보 */
export const site = {
  name: "GRIT",
  // 프로젝트 정의 문구는 ABOUT / HOME statement 확정 시 채운다
  description: "",
} as const;

export interface Destination {
  /** OptionWheel 및 네비에 표기되는 라벨 */
  label: string;
  href: string;
}

/**
 * 메인화면 OptionWheel이 돌리는 목적지 목록.
 * 라벨과 순서를 바꾸려면 여기만 고치면 휠·네비가 동시에 따라간다.
 */
export const destinations: Destination[] = [
  { label: "IDENTITY", href: "/identity" },
  { label: "ARCHIVE", href: "/archive" },
  { label: "PROCESS", href: "/process" },
  { label: "VISUAL", href: "/visual" },
  { label: "ABOUT", href: "/about" },
];

export const nav = destinations;
