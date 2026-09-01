import type { Hold } from "@/types/hold";

/**
 * 홀드 아카이브. 순서·이름·설명은 scripts/hold-sources.mjs에 있다.
 *
 * 이 파일은 `npm run hold-images`가 생성한다 — 직접 고치지 말 것.
 */
export const holds: Hold[] = [
  {
    index: "HOLD 01",
    slug: "veil",
    name: "Veil",
    description: [
      "VEIL is formed as if fabric has been stretched over a soft volume,",
      "allowing tension, folds, and woven gray textures to define its sculptural surface.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/veil-176031fd.webp", alt: "Veil hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 1,
  },
  {
    index: "HOLD 02",
    slug: "chalk",
    name: "Chalk",
    description: [
      "CHALK is shaped like a mass carved from climbing chalk, with irregular folds",
      "and a powdery white surface that emphasizes its dry, porous tactility.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/chalk-0b1c9f07.webp", alt: "Chalk hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 2,
  },
  {
    index: "HOLD 03",
    slug: "glider",
    name: "Glider",
    description: [
      "GLIDER is shaped by the silhouette of a glider in flight, with elongated wings",
      "and a metallic lavender finish that gives the form a sleek, aerodynamic presence.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/glider-c868fc7b.webp", alt: "Glider hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 3,
  },
  {
    index: "HOLD 04",
    slug: "ripple",
    name: "Ripple",
    description: [
      "RIPPLE is composed of five forms that gradually shift in scale,",
      "echoing spreading waves through clear surfaces and softly textured pale-gray edges.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/ripple-2ea6785c.webp", alt: "Ripple hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 4,
  },
  {
    index: "HOLD 05",
    slug: "cushion",
    name: "Cushion",
    description: [
      "CUSHION is shaped like a compressed padded surface, with deep folds and worn black leather-like textures",
      "that emphasize softness, pressure, and accumulated wear.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/cushion-6be1f7a9.webp", alt: "Cushion hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 5,
  },
  {
    index: "HOLD 06",
    slug: "sprout",
    name: "Sprout",
    description: [
      "SPROUT is shaped like a young shoot rising from the ground, with a long tapered form",
      "and soft off-white surface that gives it an organic presence.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/sprout-d0e917e2.webp", alt: "Sprout hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 6,
  },
  {
    index: "HOLD 07",
    slug: "fin",
    name: "Fin",
    description: [
      "FIN is shaped by the broad sweep of a tail fin, creating a light, directional silhouette",
      "with a rough mint-green surface that adds tactile depth.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/fin-1cf73fd1.webp", alt: "Fin hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 7,
  },
  {
    index: "HOLD 08",
    slug: "clover",
    name: "Clover",
    description: [
      "CLOVER is formed from four rounded lobes gathered around a narrow center,",
      "creating a balanced silhouette with a smooth charcoal surface and soft rubber-like presence.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/clover-a1276da0.webp", alt: "Clover hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 8,
  },
  {
    index: "HOLD 09",
    slug: "melt",
    name: "Melt",
    description: [
      "MELT is shaped like ice slowly melting downward, with softened edges",
      "and a frosted translucent surface that captures the transition between solid and liquid.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/melt-a92ee22e.webp", alt: "Melt hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 9,
  },
  {
    index: "HOLD 10",
    slug: "valley",
    name: "Valley",
    description: [
      "VALLEY is defined by a deep central depression between two rising ridges,",
      "with a pale blue matte surface that evokes a softly eroded landscape.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/valley-f9079478.webp", alt: "Valley hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 10,
  },
  {
    index: "HOLD 11",
    slug: "knot",
    name: "Knot",
    description: [
      "KNOT is shaped as if multiple volumes have been twisted and bound together,",
      "creating a compact form with a sense of tension, balance, and quiet force.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/knot-bb14c92c.webp", alt: "Knot hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 11,
  },
  {
    index: "HOLD 12",
    slug: "ray",
    name: "Ray",
    description: [
      "RAY is defined by a wide, symmetrical silhouette that spreads outward like wings,",
      "softened by a muted gray fur surface that adds warmth and tactile depth.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/ray-2f361de7.webp", alt: "Ray hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 12,
  },
  {
    index: "HOLD 13",
    slug: "bubble",
    name: "Bubble",
    description: [
      "BUBBLE is formed from overlapping droplet-like volumes,",
      "finished in translucent moss green to express the slick, fluid quality of soap and damp moss.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/bubble-6be7a6ec.webp", alt: "Bubble hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 13,
  },
  {
    index: "HOLD 14",
    slug: "slope",
    name: "Slope",
    description: [
      "SLOPE is shaped by a soft asymmetrical volume crossed by a sweeping diagonal ridge,",
      "with a pale ice-blue matte surface that emphasizes subtle directional movement.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/slope-238b9404.webp", alt: "Slope hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 14,
  },
  {
    index: "HOLD 15",
    slug: "whorl",
    name: "Whorl",
    description: [],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/whorl-96be01d1.webp", alt: "Whorl hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 15,
  },
  {
    index: "HOLD 16",
    slug: "crumple",
    name: "Crumple",
    description: [
      "CRUMPLE is shaped by compressed folds and soft depressions,",
      "while its pale sage-green fur surface transforms the wrinkled form into something warm and tactile.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/crumple-f6e2816a.webp", alt: "Crumple hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 16,
  },
  {
    index: "HOLD 17",
    slug: "shell",
    name: "Shell",
    description: [
      "SHELL is formed by a soft black outer mass intersected by a thin metal plate,",
      "creating a strong contrast between tactile softness and cold precision.",
    ],
    spec: { form: "—", material: "—", surface: "—", interaction: "—" },
    hero: { src: "/img/holds/shell-9356e35a.webp", alt: "Shell hold", width: 1400, height: 1400 },
    sections: [],
    processRefs: [],
    order: 17,
  },
];

export const sortedHolds = () => [...holds].sort((a, b) => a.order - b.order);

export const getHold = (slug: string) => holds.find((h) => h.slug === slug);

/** Detail 하단 Next Hold — 마지막 홀드는 처음으로 순환한다 */
export const getNextHold = (slug: string) => {
  const list = sortedHolds();
  const i = list.findIndex((h) => h.slug === slug);
  return i === -1 ? undefined : list[(i + 1) % list.length];
};
