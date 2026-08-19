import type { Hold } from "@/types/hold";

/**
 * 홀드 데이터.
 *
 * ⚠ 지금 들어 있는 건 레이아웃 확인용 자리표시 데이터다.
 * 실제 홀드 수·스펙·사진이 나오면 이 배열만 갈아끼우면 된다 — 라우트와 템플릿은 그대로다.
 */
export const holds: Hold[] = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    index: `HOLD ${n}`,
    slug: `hold-${n}`,
    name: `Hold ${n}`,
    spec: {
      form: "—",
      material: "—",
      surface: "—",
      interaction: "—",
    },
    sections: [],
    processRefs: [],
    order: i + 1,
  };
});

export const sortedHolds = () => [...holds].sort((a, b) => a.order - b.order);

export const getHold = (slug: string) => holds.find((h) => h.slug === slug);

/** Detail 하단 Next Hold — 마지막 홀드는 처음으로 순환한다 */
export const getNextHold = (slug: string) => {
  const list = sortedHolds();
  const i = list.findIndex((h) => h.slug === slug);
  return i === -1 ? undefined : list[(i + 1) % list.length];
};
