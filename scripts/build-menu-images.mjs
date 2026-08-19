/**
 * 메인 메뉴 마퀴에 흐르는 이미지 4장을 만든다.
 *
 *   npm run menu-images <grit> <archive> <process> <about>
 *
 * 원본 사진은 저장소에 넣지 않는다. 여기서 나온 public/img/menu/*.webp만 올라간다.
 *
 * 무드를 맞추려고 전부 흑백으로 굽는다. CSS filter로 걸면 매 프레임 비용이 붙고,
 * 어차피 컬러로 쓸 일이 없으므로 파일에 미리 넣는 편이 낫다.
 */
import { mkdir } from "node:fs/promises";
import { basename } from "node:path";
import sharp from "sharp";

const OUT = "public/img/menu";
const SIZE = 600;

/**
 * 로고만 다르게 굽는다.
 * - 사진: 정사각으로 꽉 채운다(cover). CSS가 캡슐 모양으로 위아래를 잘라낸다.
 * - 로고: 배경 없이 통째로 담는다(contain + 투명). 잘리면 심볼이 심볼로 안 읽힌다.
 */
const TARGETS = [
  { slug: "grit", fit: "contain", transparent: true },
  { slug: "archive", fit: "cover", transparent: false },
  { slug: "process", fit: "cover", transparent: false },
  { slug: "about", fit: "cover", transparent: false },
];

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const sources = process.argv.slice(2);
if (sources.length === 0) {
  console.error("사용법: npm run menu-images <grit> <archive> <process> <about>");
  console.error("건너뛸 자리는 - 로 둔다.");
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

for (const [i, src] of sources.entries()) {
  const target = TARGETS[i];
  if (!target || src === "-") continue;

  const out = `${OUT}/${target.slug}.webp`;
  const info = await sharp(src)
    .resize(SIZE, SIZE, { fit: target.fit, background: TRANSPARENT })
    .grayscale()
    .webp({ quality: 82, alphaQuality: 100 })
    .toFile(out);

  console.log(
    `${target.slug.padEnd(8)} ${basename(src)} → ${out}  ${(info.size / 1024).toFixed(1)}KB  (${target.fit})`,
  );
}
