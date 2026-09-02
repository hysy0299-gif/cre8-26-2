/**
 * 메인화면 아코디언 세 칸에 깔리는 이미지를 웹용으로 굽는다.
 *
 *   npm run section-images
 *
 * 칸은 세로로 긴 형태고 cover로 잘려 들어가므로, 세로 기준으로 넉넉하게 남긴다.
 * 파일명에 내용 해시를 붙여 사진을 갈아끼워도 캐시가 옛 그림을 안 내주게 한다.
 */
import { createHash } from "node:crypto";
import { access, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "image";
const OUT = "public/img/sections";
/** 열린 칸은 화면 절반쯤 되고 세로는 화면 전체다. 2배 화면까지 감당할 폭 */
const WIDTH = 1600;
const HEIGHT = 2200;

const SECTIONS = [
  { slug: "grit", file: "GRIT.png" },
  { slug: "archive", file: "ARCHIVE.png" },
  { slug: "process", file: "PROCESS.png" },
];

await mkdir(OUT, { recursive: true });

for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await rm(`${OUT}/${f}`);
}

let total = 0;
const manifest = [];

for (const { slug, file } of SECTIONS) {
  const path = `${SRC}/${file}`;
  try {
    await access(path);
  } catch {
    console.error(`없는 파일: ${path}`);
    process.exit(1);
  }

  const { data, info } = await sharp(path)
    .resize(WIDTH, HEIGHT, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: "#f5f5f5" })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });

  const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
  const name = `${slug}-${hash}.webp`;
  await writeFile(`${OUT}/${name}`, data);
  total += data.length;
  manifest.push({ slug, name });

  console.log(
    `${slug.padEnd(8)} ${file.padEnd(13)} ${info.width}x${info.height}  ${(data.length / 1024).toFixed(0)}KB`,
  );
}

console.log(`\n${SECTIONS.length}장, 합계 ${(total / 1024 / 1024).toFixed(2)}MB`);
console.log(manifest.map((m) => `  ${m.slug}: "/img/sections/${m.name}"`).join("\n"));
