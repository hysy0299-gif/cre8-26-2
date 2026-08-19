/**
 * 브랜드북 페이지를 웹용으로 굽는다.
 *
 *   npm run book-images
 *
 * 순서는 scripts/book-pages.mjs에 명시돼 있다 — 파일명 정렬을 믿으면 안 된다.
 * 원본은 저장소에 넣지 않고 여기서 나온 public/img/book/*.webp만 올라간다.
 *
 * 파일명에 내용 해시를 붙인다.
 * 이름을 고정해두면 순서를 바꿨을 때 URL이 그대로라 브라우저와 Vercel 이미지 캐시가
 * 예전 그림을 계속 내준다 — 실제로 한 번 당했다.
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, rm, access } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import { BOOK_PAGES } from "./book-pages.mjs";

const SRC = "books/8";
const OUT = "public/img/book";
const WIDTH = 1000;

await mkdir(OUT, { recursive: true });

// 해시가 바뀌면 옛 파일이 남으므로 매번 비우고 시작한다
for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await rm(`${OUT}/${f}`);
}

let total = 0;
const manifest = [];

for (const [i, file] of BOOK_PAGES.entries()) {
  const path = `${SRC}/${file}`;
  try {
    await access(path);
  } catch {
    console.error(`없는 파일: ${path}`);
    process.exit(1);
  }

  const { data, info } = await sharp(path)
    .resize(WIDTH, null, { withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });

  const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
  const name = `p${String(i + 1).padStart(2, "0")}-${hash}.webp`;
  await writeFile(`${OUT}/${name}`, data);

  total += data.length;
  manifest.push({ page: i + 1, name, width: info.width, height: info.height });
  console.log(`${name}  ${file.padEnd(26)} ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`);
}

// 데이터 파일도 같이 만든다 — 손으로 옮겨 적다 틀릴 일을 없앤다
const rows = manifest.map(
  (m) =>
    `  { src: "/img/book/${m.name}", alt: "GRIT brand book page ${String(m.page).padStart(2, "0")}", width: ${m.width}, height: ${m.height} },`,
);

await writeFile(
  "src/data/book.ts",
  [
    'import type { MediaItem } from "@/types/hold";',
    "",
    "/**",
    " * 브랜드북 페이지. 순서는 scripts/book-pages.mjs에 명시돼 있다.",
    " * 펼침면은 1 / 2·3 / 4·5 … 18·19 로 떨어진다.",
    " *",
    " * 이 파일은 `npm run book-images`가 생성한다 — 직접 고치지 말 것.",
    " */",
    "export const bookPages: MediaItem[] = [",
    ...rows,
    "];",
    "",
  ].join("\n"),
);

console.log(`\n${BOOK_PAGES.length}쪽, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log("src/data/book.ts 갱신됨");
