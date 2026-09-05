/**
 * 프로세스 북 페이지를 웹용으로 굽는다.
 *
 *   npm run book-images
 *
 * 순서는 scripts/book-pages.mjs에 명시돼 있다 — 파일명 정렬을 믿으면 안 된다.
 * 펼침면 원본은 반으로 갈라 왼쪽·오른쪽 두 쪽으로 만든다.
 * 원본은 저장소에 넣지 않고 여기서 나온 public/img/book/*.webp만 올라간다.
 *
 * 파일명에 내용 해시를 붙인다.
 * 이름을 고정해두면 순서를 바꿨을 때 URL이 그대로라 브라우저와 Vercel 이미지 캐시가
 * 예전 그림을 계속 내준다 — 실제로 한 번 당했다.
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";
import { BOOK_SOURCES, SPREAD_ASPECT } from "./book-pages.mjs";

const SRC = "fianl books";
const OUT = "public/img/book";
/**
 * 한 쪽의 폭.
 * 책이 화면 높이의 88%까지 커져서 한 쪽이 62vh다 — 1440 높이 2배 화면이면 1786px가 필요하다.
 * 그보다 작게 구우면 브라우저가 늘려 쓰면서 뭉갠다.
 */
const WIDTH = 1800;
const QUALITY = 88;

await mkdir(OUT, { recursive: true });

// 해시가 바뀌면 옛 파일이 남으므로 매번 비우고 시작한다
for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await rm(`${OUT}/${f}`);
}

/** 원본 한 장에서 나올 쪽들. 펼침면이면 왼쪽·오른쪽 두 개 */
async function pagesOf(file) {
  const path = `${SRC}/${file}`;
  try {
    await access(path);
  } catch {
    console.error(`없는 파일: ${path}`);
    process.exit(1);
  }

  const meta = await sharp(path).metadata();
  if (meta.width / meta.height < SPREAD_ASPECT) {
    return [{ file, region: null, half: "" }];
  }

  const half = Math.floor(meta.width / 2);
  return [
    { file, region: { left: 0, top: 0, width: half, height: meta.height }, half: "L" },
    {
      file,
      region: { left: meta.width - half, top: 0, width: half, height: meta.height },
      half: "R",
    },
  ];
}

let total = 0;
const manifest = [];
let page = 0;

for (const file of BOOK_SOURCES) {
  for (const { region, half } of await pagesOf(file)) {
    const pipeline = sharp(`${SRC}/${file}`);
    if (region) pipeline.extract(region);

    const { data, info } = await pipeline
      .resize(WIDTH, null, { withoutEnlargement: true, kernel: "lanczos3" })
      .flatten({ background: "#ffffff" })
      .webp({ quality: QUALITY, effort: 6 })
      .toBuffer({ resolveWithObject: true });

    page += 1;
    const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
    const name = `p${String(page).padStart(2, "0")}-${hash}.webp`;
    await writeFile(`${OUT}/${name}`, data);

    total += data.length;
    manifest.push({ page, name, width: info.width, height: info.height });
    console.log(
      `${name}  ${(file + (half ? ` ${half}` : "")).padEnd(12)} ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`,
    );
  }
}

// 데이터 파일도 같이 만든다 — 손으로 옮겨 적다 틀릴 일을 없앤다
const rows = manifest.map(
  (m) =>
    `  { src: "/img/book/${m.name}", alt: "GRIT process book page ${String(m.page).padStart(2, "0")}", width: ${m.width}, height: ${m.height} },`,
);

await writeFile(
  "src/data/book.ts",
  [
    'import type { MediaItem } from "@/types/hold";',
    "",
    "/**",
    " * 프로세스 북 페이지. 순서는 scripts/book-pages.mjs에 명시돼 있다.",
    " * 펼침면 원본을 반으로 갈라 만들었으므로, 종이 한 장이 앞뒤 두 쪽을 갖는",
    " * 구조에 그대로 맞는다 — 표지 / 면지·1쪽 / 2쪽·3쪽 …",
    " *",
    " * 이 파일은 `npm run book-images`가 생성한다 — 직접 고치지 말 것.",
    " */",
    "export const bookPages: MediaItem[] = [",
    ...rows,
    "];",
    "",
  ].join("\n"),
);

console.log(`\n${manifest.length}쪽, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log("src/data/book.ts 갱신됨");
