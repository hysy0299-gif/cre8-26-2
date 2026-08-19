/**
 * 브랜드북 페이지를 웹용으로 굽는다.
 *
 *   npm run book-images
 *
 * 순서는 scripts/book-pages.mjs에 명시돼 있다 — 파일명 정렬을 믿으면 안 된다.
 * 원본은 저장소에 넣지 않고 여기서 나온 public/img/book/*.webp만 올라간다.
 */
import { access, mkdir } from "node:fs/promises";
import sharp from "sharp";
import { BOOK_PAGES } from "./book-pages.mjs";

const SRC = "books/8";
const OUT = "public/img/book";
const WIDTH = 1000;

await mkdir(OUT, { recursive: true });

let total = 0;

for (const [i, file] of BOOK_PAGES.entries()) {
  const path = `${SRC}/${file}`;
  try {
    await access(path);
  } catch {
    console.error(`없는 파일: ${path}`);
    process.exit(1);
  }

  const slug = `p${String(i + 1).padStart(2, "0")}`;
  const info = await sharp(path)
    .resize(WIDTH, null, { withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 84 })
    .toFile(`${OUT}/${slug}.webp`);

  total += info.size;
  console.log(`${slug}  ${file.padEnd(26)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}

console.log(`\n${BOOK_PAGES.length}쪽, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
