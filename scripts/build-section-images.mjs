/**
 * 메인화면 아코디언 세 칸에 깔리는 이미지를 웹용으로 굽는다.
 *
 *   npm run section-images
 *
 * 소스는 image/ 안에서 슬러그로 시작하는 파일 중 마지막으로 넣은 것을 고른다.
 * 같은 이름으로 다시 넣으면 윈도우가 `GRIT (2).png`처럼 뒤에 번호를 붙이는데,
 * **번호가 큰 쪽이 나중에 넣은 것**이다. 그래서 번호를 먼저 보고, 없을 때만 수정시각을 본다.
 * 스크립트를 고치지 않아도 사진만 새로 넣으면 잡히게 하려는 것.
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

/** `GRIT (2).png` 의 2. 번호가 없으면 0 */
function dupIndex(name) {
  const m = name.match(/\((\d+)\)\s*\.[^.]+$/);
  return m ? Number(m[1]) : 0;
}

/** image/ 안에서 슬러그로 시작하는 파일 중 마지막으로 넣은 것 */
async function newestSource(slug) {
  const entries = await readdir(SRC);
  const candidates = entries.filter(
    (f) => f.toLowerCase().startsWith(slug) && /\.(png|jpe?g|webp|tiff?)$/i.test(f),
  );
  if (!candidates.length) return null;

  const stamped = await Promise.all(
    candidates.map(async (f) => ({
      f,
      dup: dupIndex(f),
      mtime: (await stat(`${SRC}/${f}`)).mtimeMs,
    })),
  );
  // 번호를 먼저 본다. 수정시각만 보면 안 된다 —
  // 새 사진이 `ARCHIVE (2).png`로 들어와도 옛 `ARCHIVE.png` 쪽이 몇 초 더 최신으로 잡힌다.
  stamped.sort((a, b) => b.dup - a.dup || b.mtime - a.mtime);
  return stamped[0].f;
}

/**
 * 피사체가 사진 한가운데 오도록 잘라낼 영역을 구한다.
 *
 * 칸은 cover로 채워지므로 좌우(또는 위아래)가 똑같이 잘려나간다.
 * 그래서 원본에서 피사체가 치우쳐 있으면 칸에서도 그대로 치우쳐 보인다.
 * 밝은 배경에서 어두운 쪽을 피사체로 보고 그 무게중심을 잡은 뒤,
 * 그 점을 중심으로 하는 가장 큰 직사각형을 남긴다 — 잘려나가는 건 빈 배경뿐이다.
 */
/** 잘라낸 영역 안에서 피사체 무게중심을 0~1 비율로 구한다 */
async function centroid(file, region) {
  const pipe = sharp(file);
  if (region) pipe.extract(region);
  const { data, info } = await pipe
    .greyscale()
    .resize(400, null, { fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 밝기 상위 25% 지점을 배경으로 보고, 그보다 충분히 어두우면 피사체
  const hist = new Array(256).fill(0);
  for (const v of data) hist[v]++;
  let acc = 0;
  let bg = 255;
  for (let v = 255; v >= 0; v--) {
    acc += hist[v];
    if (acc > data.length * 0.25) {
      bg = v;
      break;
    }
  }
  const th = bg - 28;

  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] < th) {
        sx += x;
        sy += y;
        n++;
      }
    }
  }
  if (!n) return null;
  return { fx: sx / n / info.width, fy: sy / n / info.height };
}

async function centeredCrop(file) {
  const meta = await sharp(file).metadata();
  /*
   * 원본 가로세로비를 지킨다.
   *
   * 무게중심을 중심으로 하는 "가장 큰 사각형"을 그냥 취하면 사진마다 비율이
   * 제각각으로 벌어진다(0.49 / 0.54 / 0.75까지 벌어졌다). 세 칸이 같은 비율이라야
   * 칸 하나하나가 사진 폭과 맞아떨어지므로, 비율은 그대로 두고 창만 옮긴다.
   */
  const aspect = meta.width / meta.height;
  let region = { left: 0, top: 0, width: meta.width, height: meta.height };
  let last = null;

  /*
   * 한 번에 안 맞는다 — 잘라내고 나면 남은 배경의 분포가 바뀌어서
   * 무게중심도 따라 움직인다. 몇 번 되풀이하면 가운데로 수렴한다.
   */
  for (let pass = 0; pass < 5; pass++) {
    const c = await centroid(file, region);
    if (!c) return null;
    last = c;
    if (Math.abs(c.fx - 0.5) < 0.004 && Math.abs(c.fy - 0.5) < 0.004) break;

    // 무게중심을 중심에 두면서 원본 비율을 지키는 가장 큰 창
    const cx = region.left + c.fx * region.width;
    const cy = region.top + c.fy * region.height;
    const halfW = Math.min(
      Math.min(cx - region.left, region.left + region.width - cx),
      Math.min(cy - region.top, region.top + region.height - cy) * aspect,
    );
    const halfH = halfW / aspect;

    region = {
      left: Math.round(cx - halfW),
      top: Math.round(cy - halfH),
      width: Math.max(1, Math.round(halfW * 2)),
      height: Math.max(1, Math.round(halfH * 2)),
    };
  }

  return { fx: last.fx, fy: last.fy, region };
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

  const meta = await sharp(`${SRC}/${file}`).metadata();
  const crop = await centeredCrop(`${SRC}/${file}`);
  const variants = [];

  for (const w of WIDTHS) {
    const pipeline = sharp(`${SRC}/${file}`);
    if (crop) pipeline.extract(crop.region);

    const { data, info } = await pipeline
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
    `${slug.padEnd(8)} ${file.padEnd(20)} ${meta.width}x${meta.height}` +
      (crop
        ? ` 중심 ${(crop.fx * 100).toFixed(0)}%,${(crop.fy * 100).toFixed(0)}% → ${crop.region.width}x${crop.region.height}`
        : "") +
      ` →  ` +
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
