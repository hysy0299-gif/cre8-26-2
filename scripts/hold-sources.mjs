/**
 * 홀드 원본 ↔ 슬러그 · 이름 · 설명 매핑.
 *
 * 순서는 의도적으로 섞어둔 고정 순서다.
 * 매번 무작위로 돌리면 서버와 클라이언트가 다른 순서를 그려 하이드레이션이 깨지고,
 * 새로고침할 때마다 아카이브가 딴 데로 가서 다시 찾기가 어렵다.
 *
 * description은 두 토막으로 나눠 둔다 — 형태 이야기와 표면 이야기.
 * 한 문단으로 붙여두면 긴 한 문장이라 눈이 미끄러진다. 문구 자체는 원문 그대로다.
 */
export const HOLD_SOURCES = [
  {
    slug: "bubble",
    file: "BUBBLE.png",
    name: "Bubble",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "MOSS 1.png", alt: "Bubble hold, view 1" },
      { file: "MOSS 2.png", alt: "Bubble hold, view 2" },
      { file: "MOSS 3.png", alt: "Bubble hold, view 3" },
    ],
    description: [
      "BUBBLE is formed from overlapping droplet-like volumes,",
      "finished in translucent moss green to express the slick, fluid quality of soap and damp moss.",
    ],
  },
  {
    slug: "sprout",
    file: "SPROUT.png",
    name: "Sprout",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "SPROUT1.png", alt: "Sprout hold, view 1" },
      { file: "SPROUT2.png", alt: "Sprout hold, view 2" },
      { file: "SPROUT3.png", alt: "Sprout hold, view 3" },
    ],
    description: [
      "SPROUT is shaped like a young shoot rising from the ground, with a long tapered form",
      "and soft off-white surface that gives it an organic presence.",
    ],
  },
  {
    slug: "ray",
    file: "RAY.png",
    name: "Ray",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "RAY1.png", alt: "Ray hold, view 1" },
      { file: "RAY2.png", alt: "Ray hold, view 2" },
      { file: "RAY3.png", alt: "Ray hold, view 3" },
    ],
    description: [
      "RAY is defined by a wide, symmetrical silhouette that spreads outward like wings,",
      "softened by a muted gray fur surface that adds warmth and tactile depth.",
    ],
  },
  {
    slug: "knot",
    file: "KNOT.png",
    name: "Knot",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "KNOT1.png", alt: "Knot hold, view 1" },
      { file: "KNOT2.png", alt: "Knot hold, view 2" },
      { file: "KNOT3.png", alt: "Knot hold, view 3" },
    ],
    description: [
      "KNOT is shaped as if multiple volumes have been twisted and bound together,",
      "creating a compact form with a sense of tension, balance, and quiet force.",
    ],
  },
  {
    slug: "whorl",
    file: "WHORL.png",
    name: "Whorl",
    description: [
      "WHORL is formed by a single ridge that coils inward in widening turns toward a shallow center,",
      "finished in a mottled pale-gray matte surface that keeps each turn legible under the hand.",
    ],
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "WHORL1.png", alt: "Whorl hold, view 1" },
      { file: "WHORL2.png", alt: "Whorl hold, view 2" },
      { file: "WHORL3.png", alt: "Whorl hold, view 3" },
    ],
  },
  {
    slug: "melt",
    file: "MELT.png",
    name: "Melt",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "MELT1.png", alt: "Melt hold, view 1" },
      { file: "MELT2.png", alt: "Melt hold, view 2" },
      { file: "MELT3.png", alt: "Melt hold, view 3" },
    ],
    description: [
      "MELT is shaped like ice slowly melting downward, with softened edges",
      "and a frosted translucent surface that captures the transition between solid and liquid.",
    ],
  },
  {
    slug: "fin",
    file: "FIN.png",
    name: "Fin",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "FIN1.png", alt: "Fin hold, view 1" },
      { file: "FIN2.png", alt: "Fin hold, view 2" },
      { file: "FIN3.png", alt: "Fin hold, view 3" },
    ],
    description: [
      "FIN is shaped by the broad sweep of a tail fin, creating a light, directional silhouette",
      "with a rough mint-green surface that adds tactile depth.",
    ],
  },
  {
    slug: "valley",
    file: "VALLEY.png",
    name: "Valley",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "VALL1.png", alt: "Valley hold, view 1" },
      { file: "VALL2.png", alt: "Valley hold, view 2" },
      { file: "VALL3.png", alt: "Valley hold, view 3" },
    ],
    description: [
      "VALLEY is defined by a deep central depression between two rising ridges,",
      "with a pale blue matte surface that evokes a softly eroded landscape.",
    ],
  },
  {
    slug: "slope",
    file: "SLOPE.png",
    name: "Slope",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "SLOPE1.png", alt: "Slope hold, view 1" },
      { file: "SLOPE2.png", alt: "Slope hold, view 2" },
      { file: "SLOPE3.png", alt: "Slope hold, view 3" },
    ],
    description: [
      "SLOPE is shaped by a soft asymmetrical volume crossed by a sweeping diagonal ridge,",
      "with a pale ice-blue matte surface that emphasizes subtle directional movement.",
    ],
  },
  {
    slug: "shell",
    file: "SHELL.png",
    name: "Shell",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "SHELL1.png", alt: "Shell hold, view 1" },
      { file: "SHELL2.png", alt: "Shell hold, view 2" },
      { file: "SHELL3.png", alt: "Shell hold, view 3" },
    ],
    description: [
      "SHELL is formed by a soft black outer mass intersected by a thin metal plate,",
      "creating a strong contrast between tactile softness and cold precision.",
    ],
  },
  {
    slug: "clover",
    file: "CLOVER.png",
    name: "Clover",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "CLO1.png", alt: "Clover hold, view 1" },
      { file: "CLO2.png", alt: "Clover hold, view 2" },
      { file: "CLO3.png", alt: "Clover hold, view 3" },
    ],
    description: [
      "CLOVER is formed from four rounded lobes gathered around a narrow center,",
      "creating a balanced silhouette with a smooth charcoal surface and soft rubber-like presence.",
    ],
  },
  {
    slug: "ripple",
    file: "RIPPLE.png",
    name: "Ripple",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "RIPPLE1.png", alt: "Ripple hold, view 1" },
      { file: "RIPPLE2.png", alt: "Ripple hold, view 2" },
      { file: "RIPPLE3.png", alt: "Ripple hold, view 3" },
    ],
    description: [
      "RIPPLE is composed of five forms that gradually shift in scale,",
      "echoing spreading waves through clear surfaces and softly textured pale-gray edges.",
    ],
  },
  {
    slug: "veil",
    file: "VEIL.png",
    name: "Veil",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "VEIL1.png", alt: "Veil hold, view 1" },
      { file: "VEIL2.png", alt: "Veil hold, view 2" },
      { file: "VEIL3.png", alt: "Veil hold, view 3" },
    ],
    description: [
      "VEIL is formed as if fabric has been stretched over a soft volume,",
      "allowing tension, folds, and woven gray textures to define its sculptural surface.",
    ],
  },
  {
    slug: "cushion",
    file: "CUSHION.png",
    name: "Cushion",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "cu1.png", alt: "Cushion hold, view 1" },
      { file: "cu2.png", alt: "Cushion hold, view 2" },
      { file: "cu3.png", alt: "Cushion hold, view 3" },
    ],
    description: [
      "CUSHION is shaped like a compressed padded surface, with deep folds and worn black leather-like textures",
      "that emphasize softness, pressure, and accumulated wear.",
    ],
  },
  {
    slug: "crumple",
    file: "CRUMPLE.png",
    name: "Crumple",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "CRUM1.png", alt: "Crumple hold, view 1" },
      { file: "CRUM2.png", alt: "Crumple hold, view 2" },
      { file: "CRUM3.png", alt: "Crumple hold, view 3" },
    ],
    description: [
      "CRUMPLE is shaped by compressed folds and soft depressions,",
      "while its pale sage-green fur surface transforms the wrinkled form into something warm and tactile.",
    ],
  },
  {
    slug: "glider",
    file: "GLIDER.png",
    name: "Glider",
    /** 상세 뷰 — holder thumnail/ 의 3장. 오른쪽 썸네일로 걸린다 */
    views: [
      { file: "GL1.png", alt: "Glider hold, view 1" },
      { file: "GL2.png", alt: "Glider hold, view 2" },
      { file: "GL3.png", alt: "Glider hold, view 3" },
    ],
    description: [
      "GLIDER is shaped by the silhouette of a glider in flight, with elongated wings",
      "and a metallic lavender finish that gives the form a sleek, aerodynamic presence.",
    ],
  },
];
