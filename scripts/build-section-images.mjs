/**
 * 메인화면 아코디언 세 칸에 깔리는 이미지를 웹용으로 굽는다.
 *
 *   npm run section-images
 *
 * 소스는 image/ 안에서 슬러그로 시작하는 파일 중 **가장 최근 것**을 고른다.
 * 같은 사진을 다시 받으면 윈도우가 `GRIT (2).png`처럼 이름을 바꿔 놓는데,
 * 그때마다 스크립트를 고치지 않아도 새 파일이 자동으로 잡히게 하려는 것.
 *
 * 한 칸당 두 벌(w1/w2)을 굽고 srcset으로 넘긴다.
 * 칸은 화면의 25~50% 폭이라 한 벌만 구우면 저해상 화면에선 과하고
 * 레티나에선 모자란다 — 그 사이를 브라우저가 고르게 둔다.
 *
 * 파일명에 내용 해시를 붙여 사진을 갈아끼워도 캐시가 옛 그림을 안 내주게 한다.
 */
import { createHash } from "node:crypto";
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "image";
const OUT = "public/img/sections";

/**
 * 굽는 폭 두 벌.
 * 열린 칸이 화면 폭의 약 45%니까 1440 화면 2배율에서 ≈1300px, 2560 화면 2배율에서 ≈2300px.
 * 그 두 지점을 각각 덮는다.
 */
const WIDTHS = [1400, 2600];
/** 세로로 긴 사진이라 높이도 같이 묶어둔다 — 어느 쪽이든 먼저 걸리는 쪽으로 줄어든다 */
const MAX_HEIGHT = 3800;

/**
 * 품질 92 + lanczos3.
 * 이전엔 84였는데, 이 사진들은 흑백 필터를 먹고 나가서 채도가 가려주던
 * 블록 노이즈가 그대로 드러났다. 흑백으로 볼 사진일수록 압축을 덜 해야 한다.
 */
const QUALITY = 92;

const SLUGS = ["grit", "archive", "process"];

/** image/ 안에서 슬러그로 시작하는 파일 중 제일 최근 것 */
async function newestSource(slug) {
  const entries = await readdir(SRC);
  const candidates = entries.filter(
    (f) => f.toLowerCase().startsWith(slug) && /\.(png|jpe?g|webp|tiff?)$/i.test(f),
  );
  if (!candidates.length) return null;

  const stamped = await Promise.all(
    candidates.map(async (f) => ({ f, mtime: (await stat(`${SRC}/${f}`)).mtimeMs })),
  );
  stamped.sort((a, b) => b.mtime - a.mtime);
  return stamped[0].f;
}

await mkdir(OUT, { recursive: true });

for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await rm(`${OUT}/${f}`);
}

let total = 0;
const manifest = [];

for (const slug of SLUGS) {
  const file = await newestSource(slug);
  if (!file) {
    console.error(`${SRC}/ 안에 ${slug}* 로 시작하는 이미지가 없다`);
    process.exit(1);
  }

  const src = sharp(`${SRC}/${file}`);
  const meta = await src.metadata();
  const variants = [];

  for (const w of WIDTHS) {
    const { data, info } = await sharp(`${SRC}/${file}`)
      .resize(w, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
        kernel: "lanczos3",
      })
      // 원본에 알파가 있다. 바탕색으로 눌러야 흰 테두리가 안 남는다
      .flatten({ background: "#f5f5f5" })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toBuffer({ resolveWithObject: true });

    const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
    const name = `${slug}-${info.width}-${hash}.webp`;
    await writeFile(`${OUT}/${name}`, data);
    total += data.length;
    variants.push({ name, width: info.width, height: info.height, bytes: data.length });
  }

  manifest.push({ slug, file, variants });

  console.log(
    `${slug.padEnd(8)} ${file.padEnd(20)} ${meta.width}x${meta.height} →  ` +
      variants
        .map((v) => `${v.width}x${v.height} ${(v.bytes / 1024).toFixed(0)}KB`)
        .join("  |  "),
  );
}

console.log(`\n${SLUGS.length}칸 ${SLUGS.length * WIDTHS.length}장, 합계 ${(total / 1024 / 1024).toFixed(2)}MB\n`);

// src/data/site.ts 에 그대로 붙일 형태로 뱉는다
for (const { slug, variants } of manifest) {
  const [small, large] = variants;
  console.log(`  ${slug}:`);
  console.log(`    src: "/img/sections/${small.name}",`);
  console.log(
    `    srcSet: "/img/sections/${small.name} ${small.width}w, /img/sections/${large.name} ${large.width}w",`,
  );
  console.log(`    width: ${large.width}, height: ${large.height},`);
}
