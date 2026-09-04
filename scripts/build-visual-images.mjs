/**
 * GRIT 비주얼 이미지를 웹용으로 굽는다.
 *
 *   npm run visual-images
 *
 * 매니페스토가 끝나고 로고가 선 뒤에 날아가는 사진들이다.
 * 흰 배경에 홀드만 놓인 제품컷은 뺐다 — 여기 들어가는 건 손·제작·소재·벽 같은 장면이다.
 *
 * 자르지 않는다. 넣어준 그대로의 가로세로비로 굽고, 화면에서도 그 비율 그대로 선다.
 * 파일명에 내용 해시를 붙여 사진을 갈아끼워도 캐시가 옛 그림을 안 내주게 한다.
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "image";
const OUT = "public/img/visuals";
/** 긴 변 기준. 화면에서 한 장이 절반쯤 차지하므로 2배 화면까지 이 정도면 된다 */
const LONG_EDGE = 1600;
const QUALITY = 88;

/** 순서대로. 파일명이 UUID라 무엇인지 옆에 적어둔다 */
const VISUALS = [
  { file: "045dae44-fffd-4eca-b4e8-866283aad1b1.png", alt: "A hand resting on a cast hold" },
  { file: "08221707-e034-48fe-a4fe-f54bbdb1fc82.png", alt: "Hands shaping material on a board" },
  { file: "b5ebcff4-0eed-4f69-89f6-57581fc4c69f.png", alt: "Labelled material tests" },
  { file: "KakaoTalk_20260902_190812238_06.jpg", alt: "A tray of hold samples" },
  { file: "7ee6b6fa-9274-41a9-90ba-a7da0c317fca.png", alt: "Cast forms on a white wall" },
  { file: "KakaoTalk_20260902_190812238_08.jpg", alt: "Holds set on a climbing wall" },
  { file: "217134a5-5e8d-43f0-81eb-d68a71571bb4.png", alt: "Hands gripping a hold" },
];

await mkdir(OUT, { recursive: true });

for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await rm(`${OUT}/${f}`);
}

let total = 0;
const manifest = [];

for (const [i, { file, alt }] of VISUALS.entries()) {
  const path = `${SRC}/${file}`;
  try {
    await access(path);
  } catch {
    console.error(`없는 파일: ${path}`);
    process.exit(1);
  }

  const meta = await sharp(path).metadata();
  const wide = meta.width >= meta.height;

  const { data, info } = await sharp(path)
    // 긴 변만 묶는다 — fit:"inside"라 짧은 변은 비율대로 따라오고 잘리지 않는다
    .resize(wide ? LONG_EDGE : null, wide ? null : LONG_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
      kernel: "lanczos3",
    })
    .flatten({ background: "#ffffff" })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer({ resolveWithObject: true });

  const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
  const name = `v${String(i + 1).padStart(2, "0")}-${hash}.webp`;
  await writeFile(`${OUT}/${name}`, data);

  total += data.length;
  manifest.push({ name, alt, width: info.width, height: info.height });
  console.log(
    `${name}  ${file.padEnd(46)} ${meta.width}x${meta.height} → ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`,
  );
}

const rows = manifest.map(
  (m) =>
    `  { src: "/img/visuals/${m.name}", alt: ${JSON.stringify(m.alt)}, width: ${m.width}, height: ${m.height} },`,
);

await writeFile(
  "src/data/visuals.ts",
  [
    "/**",
    " * GRIT 비주얼 — 매니페스토 뒤에 날아가는 사진들.",
    " * 순서와 목록은 scripts/build-visual-images.mjs에 있다.",
    " *",
    " * 이 파일은 `npm run visual-images`가 생성한다 — 직접 고치지 말 것.",
    " */",
    "export interface Visual {",
    "  src: string;",
    "  alt: string;",
    "  width: number;",
    "  height: number;",
    "}",
    "",
    "export const visuals: Visual[] = [",
    ...rows,
    "];",
    "",
  ].join("\n"),
);

console.log(`\n${manifest.length}장, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log("src/data/visuals.ts 갱신됨");
