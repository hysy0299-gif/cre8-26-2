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
    slug: "slope",
    file: "SLOPE.png",
    name: "Slope",
    description: [
      "SLOPE is shaped by a soft asymmetrical volume crossed by a sweeping diagonal ridge,",
      "with a pale ice-blue matte surface that emphasizes subtle directional movement.",
    ],
  },
  {
    slug: "sprout",
    file: "SPROUT.png",
    name: "Sprout",
    description: [
      "SPROUT is shaped like a young shoot rising from the ground, with a long tapered form",
      "and soft off-white surface that gives it an organic presence.",
    ],
  },
  {
    slug: "valley",
    file: "VALLEY.png",
    name: "Valley",
    description: [
      "VALLEY is defined by a deep central depression between two rising ridges,",
      "with a pale blue matte surface that evokes a softly eroded landscape.",
    ],
  },
  {
    slug: "glider",
    file: "GLIDER.png",
    name: "Glider",
    description: [
      "GLIDER is shaped by the silhouette of a glider in flight, with elongated wings",
      "and a metallic lavender finish that gives the form a sleek, aerodynamic presence.",
    ],
  },
  {
    slug: "ripple",
    file: "RIPPLE.png",
    name: "Ripple",
    description: [
      "RIPPLE is composed of five forms that gradually shift in scale,",
      "echoing spreading waves through clear surfaces and softly textured pale-gray edges.",
    ],
  },
  {
    slug: "bubble",
    file: "BUBBLE.png",
    name: "Bubble",
    description: [
      "BUBBLE is formed from overlapping droplet-like volumes,",
      "finished in translucent moss green to express the slick, fluid quality of soap and damp moss.",
    ],
  },
  {
    slug: "fin",
    file: "FIN.png",
    name: "Fin",
    description: [
      "FIN is shaped by the broad sweep of a tail fin, creating a light, directional silhouette",
      "with a rough mint-green surface that adds tactile depth.",
    ],
  },
  {
    slug: "ray",
    file: "RAY.png",
    name: "Ray",
    description: [
      "RAY is defined by a wide, symmetrical silhouette that spreads outward like wings,",
      "softened by a muted gray fur surface that adds warmth and tactile depth.",
    ],
  },
  {
    slug: "cushion",
    file: "CUSHION.png",
    name: "Cushion",
    description: [
      "CUSHION is shaped like a compressed padded surface, with deep folds and worn black leather-like textures",
      "that emphasize softness, pressure, and accumulated wear.",
    ],
  },
  {
    slug: "clover",
    file: "CLOVER.png",
    name: "Clover",
    description: [
      "CLOVER is formed from four rounded lobes gathered around a narrow center,",
      "creating a balanced silhouette with a smooth charcoal surface and soft rubber-like presence.",
    ],
  },
  {
    slug: "shell",
    file: "SHELL.png",
    name: "Shell",
    description: [
      "SHELL is formed by a soft black outer mass intersected by a thin metal plate,",
      "creating a strong contrast between tactile softness and cold precision.",
    ],
  },
  {
    slug: "knot",
    file: "KNOT.png",
    name: "Knot",
    description: [
      "KNOT is shaped as if multiple volumes have been twisted and bound together,",
      "creating a compact form with a sense of tension, balance, and quiet force.",
    ],
  },
  {
    slug: "whorl",
    file: "WHORL.png",
    name: "Whorl",
    description: [],
  },
  {
    slug: "chalk",
    file: "CHALK.png",
    name: "Chalk",
    description: [
      "CHALK is shaped like a mass carved from climbing chalk, with irregular folds",
      "and a powdery white surface that emphasizes its dry, porous tactility.",
    ],
  },
  {
    slug: "crumple",
    file: "CRUMPLE.png",
    name: "Crumple",
    description: [
      "CRUMPLE is shaped by compressed folds and soft depressions,",
      "while its pale sage-green fur surface transforms the wrinkled form into something warm and tactile.",
    ],
  },
  {
    slug: "melt",
    file: "MELT.png",
    name: "Melt",
    description: [
      "MELT is shaped like ice slowly melting downward, with softened edges",
      "and a frosted translucent surface that captures the transition between solid and liquid.",
    ],
  },
  {
    slug: "veil",
    file: "VEIL.png",
    name: "Veil",
    description: [
      "VEIL is formed as if fabric has been stretched over a soft volume,",
      "allowing tension, folds, and woven gray textures to define its sculptural surface.",
    ],
  },
];
