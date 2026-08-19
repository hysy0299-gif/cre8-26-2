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
/** GRIT WHITE — 네 장의 배경을 여기로 통일한다 */
const GROUND = { r: 245, g: 245, b: 245, alpha: 1 };

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
    // 원본 배경이 제각각(투명 로고 / 흰 JPEG / 흰 배경 사진)이라 넷 다 GRIT WHITE 판에 얹어
    // 통일한다. 흰 오브제가 섞여 있어 배경만 따로 지우는 건 불가능하다.
    .resize(SIZE, SIZE, { fit: "contain", background: GROUND })
    .flatten({ background: GROUND })
    .webp({ quality: 82 })
    .toFile(out);

  console.log(`${slug.padEnd(8)} ${basename(src)} → ${out}  ${(info.size / 1024).toFixed(1)}KB`);
}
