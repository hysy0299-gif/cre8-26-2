/**
 * 브랜드북 페이지를 웹용으로 굽는다.
 *
 *   npm run book-images
 *
 * 순서는 탐색기에 보이는 폴더 순서를 그대로 따른다(자연 정렬).
 * `grit_brandbook 20.png`이 공백 때문에 맨 앞에 오는 것도 의도한 순서다.
 */
import { mkdir, readdir } from "node:fs/promises";
import sharp from "sharp";

const SRC = "books/8";
const OUT = "public/img/book";
const WIDTH = 1000;

await mkdir(OUT, { recursive: true });

/** 탐색기와 같은 자연 정렬 */
const files = (await readdir(SRC))
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let total = 0;
const manifest = [];

for (const [i, file] of files.entries()) {
  const slug = `p${String(i + 1).padStart(2, "0")}`;
  const info = await sharp(`${SRC}/${file}`)
    .resize(WIDTH, null, { withoutEnlargement: true })
    .flatten({ background: "#ffffff" })
    .webp({ quality: 84 })
    .toFile(`${OUT}/${slug}.webp`);

  total += info.size;
  manifest.push({ slug, width: info.width, height: info.height });
  console.log(
    `${slug}  ${file.padEnd(26)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`,
  );
}

console.log(`\n${files.length}쪽, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log(JSON.stringify(manifest[0]), "…", JSON.stringify(manifest.at(-1)));
