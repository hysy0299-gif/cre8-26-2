/**
 * fonts/*.otf → src/fonts/*.woff2 (Latin 서브셋)
 *
 * 원본 .otf는 저장소에 올리지 않는다(용량 + 라이선스). 웹에 나가는 건 woff2뿐이다.
 * 원본을 갱신했을 때만 `npm run fonts`로 다시 돌리면 된다.
 *
 * Helvetica Neue 원본은 라틴 밖 글리프까지 들고 있어 통째로 쓰면 weight당 200KB에 가깝다.
 * 한글은 이 폰트에 없어서 어차피 폴백이므로, 라틴만 남겨도 잃는 게 없다.
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";
import subsetFont from "subset-font";

const SRC = "fonts";
const OUT = "src/fonts";

/** google-fonts의 latin + latin-ext 범위 */
const RANGES = [
  [0x0020, 0x007e], // Basic Latin
  [0x00a0, 0x00ff], // Latin-1 Supplement
  [0x0100, 0x017f], // Latin Extended-A
  [0x2018, 0x201d], // 따옴표
  [0x2013, 0x2014], // en/em dash
  [0x2026, 0x2026], // …
  [0x2022, 0x2022], // •
  [0x00d7, 0x00d7], // ×
  [0x2192, 0x2192], // →
  [0x20ac, 0x20ac], // €
  [0x2122, 0x2122], // ™
];

const text = RANGES.flatMap(([start, end]) => {
  const out = [];
  for (let cp = start; cp <= end; cp++) out.push(String.fromCodePoint(cp));
  return out;
}).join("");

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => /\.(otf|ttf)$/i.test(f));
if (files.length === 0) {
  console.error(`${SRC}/ 에 .otf/.ttf가 없습니다.`);
  process.exit(1);
}

let before = 0;
let after = 0;

for (const file of files) {
  const input = await readFile(join(SRC, file));
  const output = await subsetFont(input, text, { targetFormat: "woff2" });
  const name = `${parse(file).name}.woff2`;
  await writeFile(join(OUT, name), output);
  before += input.length;
  after += output.length;
  const pct = Math.round((1 - output.length / input.length) * 100);
  console.log(
    `${file} ${(input.length / 1024).toFixed(0)}KB → ${name} ${(output.length / 1024).toFixed(1)}KB (-${pct}%)`,
  );
}

console.log(`합계 ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(1)}KB`);
