/** 사이트 전역 정보 — 브랜드명·태그라인은 확정 후 여기만 교체한다 */
export const site = {
  name: "CRE8 26-2",
  // 프로젝트 정의 문구는 ABOUT / HOME statement 확정 시 채운다
  description: "",
} as const;

export const nav = [
  { label: "ARCHIVE", href: "/archive" },
  { label: "PROCESS", href: "/process" },
  { label: "ABOUT", href: "/about" },
] as const;
