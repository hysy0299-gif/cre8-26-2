/**
 * 홀드 베리에이션 사진을 웹용으로 굽는다.
 *
 *   npm run hold-images
 *
 * 메뉴 이미지와 달리 흑백으로 만들지 않는다 — CMF의 C가 컬러라서
 * 색을 빼면 이 아카이브가 존재할 이유가 없어진다.
 * 원본이 배경 없이 따여 있으므로 알파를 그대로 살려 바탕 위에 오브제만 뜨게 한다.
 */
import { mkdir } from "node:fs/promises";
import sharp from "sharp";
import { HOLD_SOURCES } from "./hold-sources.mjs";

const OUT = "public/img/holds";
const SIZE = 1200;

await mkdir(OUT, { recursive: true });

let total = 0;
for (const { slug, file } of HOLD_SOURCES) {
  const info = await sharp(`image/${file}`)
    .resize(SIZE, SIZE, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, alphaQuality: 100 })
    .toFile(`${OUT}/${slug}.webp`);
  total += info.size;
  console.log(`${slug.padEnd(10)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}

console.log(`\n${HOLD_SOURCES.length}장, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
