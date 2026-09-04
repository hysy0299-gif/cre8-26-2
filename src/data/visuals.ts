/**
 * GRIT 비주얼 — 매니페스토 뒤에 날아가는 사진들.
 * 순서와 목록은 scripts/build-visual-images.mjs에 있다.
 *
 * 이 파일은 `npm run visual-images`가 생성한다 — 직접 고치지 말 것.
 */
export interface Visual {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const visuals: Visual[] = [
  { src: "/img/visuals/v01-f9bbf87b.webp", alt: "A hand resting on a cast hold", width: 1600, height: 900 },
  { src: "/img/visuals/v02-75b2b07b.webp", alt: "Hands shaping material on a board", width: 1536, height: 1536 },
  { src: "/img/visuals/v03-b41ec106.webp", alt: "Labelled material tests", width: 1280, height: 714 },
  { src: "/img/visuals/v04-2c6e8f69.webp", alt: "A tray of hold samples", width: 1600, height: 1199 },
  { src: "/img/visuals/v05-7e1afa7e.webp", alt: "Cast forms on a white wall", width: 1600, height: 1600 },
  { src: "/img/visuals/v06-80227b6e.webp", alt: "Holds set on a climbing wall", width: 1600, height: 1067 },
  { src: "/img/visuals/v07-3ab7f778.webp", alt: "Hands gripping a hold", width: 1195, height: 1600 },
];
