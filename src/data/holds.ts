import type { Hold } from "@/types/hold";

/**
 * 홀드 데이터. 홀드가 늘어도 라우트는 /archive/[hold] 하나 그대로다.
 * 촬영/스펙 확정 후 여기에 객체를 추가한다.
 */
export const holds: Hold[] = [];

export const sortedHolds = () => [...holds].sort((a, b) => a.order - b.order);

export const getHold = (slug: string) => holds.find((h) => h.slug === slug);

/** Detail 하단 Next Hold — 마지막 홀드는 처음으로 순환한다 */
export const getNextHold = (slug: string) => {
  const list = sortedHolds();
  const i = list.findIndex((h) => h.slug === slug);
  return i === -1 ? undefined : list[(i + 1) % list.length];
};
