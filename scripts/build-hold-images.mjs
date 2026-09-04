/**
 * 홀드 사진을 웹용으로 굽고 src/data/holds.ts를 생성한다.
 *
 *   npm run hold-images
 *
 * 흑백으로 만들지 않는다 — CMF의 C가 컬러라서 색을 빼면 이 아카이브가 존재할 이유가 없다.
 * 원본이 배경 없이 따여 있으므로 알파를 살려 바탕 위에 오브제만 뜨게 한다.
 *
 * 파일명에 내용 해시를 붙인다. 이름을 고정해두면 사진을 갈아끼웠을 때 URL이 그대로라
 * 브라우저와 Vercel 이미지 캐시가 예전 그림을 계속 내준다 — 브랜드북에서 한 번 당했다.
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { HOLD_SOURCES } from "./hold-sources.mjs";

const SRC = "HOLDER (C)";
/** 상세 뷰 원본. 배경이 살아 있는 사진이라 잘라내지 않는다 */
const VIEW_SRC = "holder thumnail";
const OUT = "public/img/holds";
const VIEW_OUT = "public/img/holds/views";
const SIZE = 2200;
/** 뷰는 홀드만큼 클 일이 없다 — 오른쪽 썸네일과 가운데 큰 그림 둘 다 이걸로 쓴다 */
const VIEW_SIZE = 1600;

let total = 0;

await mkdir(OUT, { recursive: true });
await mkdir(VIEW_OUT, { recursive: true });

for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await rm(`${OUT}/${f}`);
}
for (const f of await readdir(VIEW_OUT)) {
  if (f.endsWith(".webp")) await rm(`${VIEW_OUT}/${f}`);
}

/**
 * 상세 뷰를 굽는다. 대표 이미지가 첫 장으로 들어가서,
 * 썸네일을 눌러 돌아다니다 원래 그림으로 돌아올 수 있다.
 *
 * 홀드 본체와 달리 배경이 살아 있는 사진이라 trim하지 않는다 — 잘리면 안 된다.
 */
async function buildViews(hold, hero) {
  if (!hold.views?.length) return null;

  const out = [hero];
  for (const [i, view] of hold.views.entries()) {
    const { data, info } = await sharp(`${VIEW_SRC}/${view.file}`)
      .resize(VIEW_SIZE, VIEW_SIZE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100 })
      .toBuffer({ resolveWithObject: true });

    const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
    const name = `${hold.slug}-${String(i + 1).padStart(2, "0")}-${hash}.webp`;
    await writeFile(`${VIEW_OUT}/${name}`, data);
    total += data.length;

    out.push({
      src: `/img/holds/views/${name}`,
      alt: view.alt,
      width: info.width,
      height: info.height,
    });
    console.log(`  view ${name}  ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`);
  }
  return out;
}

const rows = [];

for (const [i, hold] of HOLD_SOURCES.entries()) {
  const path = `${SRC}/${hold.file}`;
  try {
    await access(path);
  } catch {
    console.error(`없는 파일: ${path}`);
    process.exit(1);
  }

  const { data, info } = await sharp(path)
    // 원본은 5160 정사각 캔버스 한가운데 오브제가 떠 있다.
    // 투명 여백을 먼저 잘라내야 같은 픽셀 수로 오브제가 훨씬 크게 담긴다.
    .trim({ threshold: 1 })
    .resize(SIZE, SIZE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer({ resolveWithObject: true });

  const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
  const name = `${hold.slug}-${hash}.webp`;
  await writeFile(`${OUT}/${name}`, data);
  total += data.length;

  const hero = {
    src: `/img/holds/${name}`,
    alt: `${hold.name} hold`,
    width: info.width,
    height: info.height,
  };
  const views = await buildViews(hold, hero);

  const index = `HOLD ${String(i + 1).padStart(2, "0")}`;
  const desc = hold.description.map((line) => `      ${JSON.stringify(line)},`).join("\n");

  rows.push(
    [
      "  {",
      `    index: ${JSON.stringify(index)},`,
      `    slug: ${JSON.stringify(hold.slug)},`,
      `    name: ${JSON.stringify(hold.name)},`,
      hold.description.length ? `    description: [\n${desc}\n    ],` : "    description: [],",
      `    spec: { form: "—", material: "—", surface: "—", interaction: "—" },`,
      `    hero: ${JSON.stringify(hero)},`,
      views ? `    views: ${JSON.stringify(views)},` : null,
      "    sections: [],",
      "    processRefs: [],",
      `    order: ${i + 1},`,
      "  },",
    ].join("\n"),
  );

  console.log(
    `${hold.slug.padEnd(9)} ${hold.file.padEnd(13)} ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`,
  );
}

await writeFile(
  "src/data/holds.ts",
  [
    'import type { Hold } from "@/types/hold";',
    "",
    "/**",
    " * 홀드 아카이브. 순서·이름·설명은 scripts/hold-sources.mjs에 있다.",
    " *",
    " * 이 파일은 `npm run hold-images`가 생성한다 — 직접 고치지 말 것.",
    " */",
    "export const holds: Hold[] = [",
    ...rows,
    "];",
    "",
    "export const sortedHolds = () => [...holds].sort((a, b) => a.order - b.order);",
    "",
    "export const getHold = (slug: string) => holds.find((h) => h.slug === slug);",
    "",
    "/** Detail 하단 Next Hold — 마지막 홀드는 처음으로 순환한다 */",
    "export const getNextHold = (slug: string) => {",
    "  const list = sortedHolds();",
    "  const i = list.findIndex((h) => h.slug === slug);",
    "  return i === -1 ? undefined : list[(i + 1) % list.length];",
    "};",
    "",
  ].join("\n"),
);

console.log(`\n${HOLD_SOURCES.length}종, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log("src/data/holds.ts 갱신됨");
