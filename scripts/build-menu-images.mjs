/**
 * 메인 메뉴 마퀴에 흐르는 이미지 4장을 만든다.
 *
 *   node scripts/build-menu-images.mjs <grit> <archive> <process> <about>
 *
 * 원본 사진은 저장소에 넣지 않는다. 여기서 나온 public/img/menu/*.webp만 올라간다.
 * 마퀴 칸이 정사각이고 contain으로 들어가므로 정사각 캔버스에 맞춰 여백째로 담는다.
 */
import { mkdir } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

const OUT = "public/img/menu";
const SIZE = 600;
const SLUGS = ["grit", "archive", "process", "about"];

const sources = process.argv.slice(2);
if (sources.length === 0) {
  console.error("사용법: node scripts/build-menu-images.mjs <grit> <archive> <process> <about>");
  console.error("건너뛸 자리는 - 로 둔다.");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

for (const [i, src] of sources.entries()) {
  const slug = SLUGS[i];
  if (!slug || src === "-") continue;

  const out = `${OUT}/${slug}.webp`;
  const info = await sharp(src)
    // 알파는 살린다 — 마퀴 배경색이 비쳐야 로고가 판에 얹힌 것처럼 보이지 않는다
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 82 })
    .toFile(out);

  console.log(`${slug.padEnd(8)} ${basename(src)} → ${out}  ${(info.size / 1024).toFixed(1)}KB`);
}
