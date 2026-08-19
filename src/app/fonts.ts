import localFont from "next/font/local";

/**
 * GRIT 본문 서체 — Helvetica Neue.
 * 지급된 굵기는 Light / Bold / Heavy 셋뿐이다. 400(Regular)이 없으므로
 * 기본 굵기를 300으로 두고, 이 세 단만 쓴다(굵기를 섞으면 브라우저가 합성해 뭉갠다).
 */
export const helveticaNeue = localFont({
  src: [
    { path: "../fonts/HelveticaNeueLight.woff2", weight: "300", style: "normal" },
    { path: "../fonts/HelveticaNeueBold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/HelveticaNeueHeavy.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-grit",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});
