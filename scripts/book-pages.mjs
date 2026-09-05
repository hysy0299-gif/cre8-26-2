/**
 * 프로세스 북 원본 순서.
 *
 * `fianl books/` 안에 아트보드 번호로 들어 있다.
 * 파일명 규칙은 `grit_brandbook<아트보드> <변형>.png` 이고, 아트보드 번호가 곧 순서다.
 * 31·32번만 낱장(표지에 쓰는 보드 사진)이고 나머지는 전부 펼침면이다.
 *
 * 원본은 두 종류다
 * - 낱장(0.707) — 앞뒤 표지 두 장뿐
 * - 펼침면(1.414) — 나머지 29장. A판 두 쪽이 붙어 있다
 *
 * 그래서 펼침면은 반으로 갈라 왼쪽·오른쪽 두 쪽으로 만든다.
 * 그렇게 하면 쪽수가 1 + 29×2 + 1 = 60쪽으로 딱 떨어지고,
 * 종이 한 장이 앞뒤 두 쪽을 갖는 구조에 정확히 맞는다 —
 * 표지 / 면지·1쪽 / 2쪽·3쪽 … 으로 펼침면이 한 화면에 제대로 붙어 나온다.
 */

/** 앞표지 → 펼침면 29장 → 뒷표지 */
export const BOOK_SOURCES = [
  "grit_brandbook31 1.png",
  "grit_brandbook2 10.png",
  "grit_brandbook2 11.png",
  "grit_brandbook3 2.png",
  "grit_brandbook4 1.png",
  "grit_brandbook5 1.png",
  "grit_brandbook6 1.png",
  "grit_brandbook7 1.png",
  "grit_brandbook8 1.png",
  "grit_brandbook9 1.png",
  "grit_brandbook10 1.png",
  "grit_brandbook11 1.png",
  "grit_brandbook12 1.png",
  "grit_brandbook13 1.png",
  "grit_brandbook14 1.png",
  "grit_brandbook15 1.png",
  "grit_brandbook16 1.png",
  "grit_brandbook17 1.png",
  "grit_brandbook18 1.png",
  "grit_brandbook19 1.png",
  "grit_brandbook20 1.png",
  "grit_brandbook21 1.png",
  "grit_brandbook22 1.png",
  "grit_brandbook23 1.png",
  "grit_brandbook24 1.png",
  "grit_brandbook25 1.png",
  "grit_brandbook26 1.png",
  "grit_brandbook27 1.png",
  "grit_brandbook28 1.png",
  "grit_brandbook29 1.png",
  "grit_brandbook 32.png",
];

/**
 * 이 비율보다 넓으면 펼침면으로 보고 반으로 가른다.
 * 낱장은 0.707, 펼침면은 1.414라 그 사이 어디를 잡아도 갈린다.
 */
export const SPREAD_ASPECT = 1.0;
