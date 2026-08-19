/**
 * 브랜드북 페이지 순서.
 *
 * 파일명 정렬로는 순서가 안 나온다 —
 * 표지가 `grit_brandbook 20.png`이고, 빈 회색 페이지 세 장이 전부 `grit_brandbook3 *`이라
 * 자연 정렬하면 마지막 회색 한 장이 앞쪽에 끼어든다.
 *
 * 파일명 숫자가 곧 쪽번호라는 규칙(2→2쪽, 5→5쪽 … 19→19쪽)이 있고,
 * 빠진 번호 4·16과 표지 1쪽을 회색 세 장과 `20`이 메운다.
 * 헷갈릴 여지를 없애려고 여기 순서를 그대로 적어둔다.
 *
 * 펼침면은 1 / 2·3 / 4·5 … 18·19 로 떨어진다.
 */
export const BOOK_PAGES = [
  "grit_brandbook 20.png", // 01  표지 — 보드 위 홀드 6개
  "grit_brandbook2 1.png", // 02  Be Experimental, GRIT
  "grit_brandbook3 1.png", // 03  여백
  "grit_brandbook3 2.png", // 04  여백
  "grit_brandbook5 1.png", // 05  GRIT 로고 + 서문
  "grit_brandbook6 1.png", // 06  여백(도트)
  "grit_brandbook7 1.png", // 07  손
  "grit_brandbook8 1.png", // 08  00
  "grit_brandbook9 1.png", // 09  암면 텍스처
  "grit_brandbook10 1.png", // 10  01
  "grit_brandbook11 1.png", // 11  홀드 컬럼
  "grit_brandbook12 1.png", // 12  02
  "grit_brandbook13 1.png", // 13  손 + 홀드
  "grit_brandbook14 1.png", // 14  03
  "grit_brandbook15 1.png", // 15  드로잉
  "grit_brandbook3 3.png", // 16  여백
  "grit_brandbook17 1.png", // 17  클라이머
  "grit_brandbook18 1.png", // 18  GRIT 로고 + (a)(b)(c)
  "grit_brandbook19 1.png", // 19  오브제
];
