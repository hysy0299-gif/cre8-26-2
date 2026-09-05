// exhibition/ 는 GitHub Pages가 브랜치 루트에서 그대로 서빙한다.
// Vercel에서도 같은 파일을 쓰려고 빌드 전에 public/ 아래로 복사한다.
// 원본은 언제나 exhibition/ 쪽이고, public/exhibition/ 은 빌드 산출물이라
// .gitignore에 들어가 있다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const from = path.join(root, "exhibition");
const to = path.join(root, "public", "exhibition");

if (!fs.existsSync(from)) {
  console.log("exhibition/ 없음 — 건너뜀");
  process.exit(0);
}

fs.rmSync(to, { recursive: true, force: true });
fs.mkdirSync(to, { recursive: true });

let n = 0;
for (const name of fs.readdirSync(from)) {
  if (!name.endsWith(".html")) continue;
  fs.copyFileSync(path.join(from, name), path.join(to, name));
  n++;
}
console.log(`exhibition → public/exhibition: ${n}개`);
