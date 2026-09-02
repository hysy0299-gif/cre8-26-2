import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 화면을 세로로 나눠 갖고, 커서를 올린 칸이 열린다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 */

/** 상자 높이. 위아래 여백(page-margin)을 빼고도 남는 선 */
const HEIGHT_DVH = 78;
/** 칸 사이 간격(px). 상자 폭을 계산할 때 같이 빼야 한다 */
const GAP = 10;
/** 가장 넓은 사진이 열렸을 때 안쪽 폭에서 차지할 비율 */
const OPEN_RATIO = 0.5;

/**
 * 상자 폭은 사진에서 나온다.
 *
 * 칸 높이는 상자 높이와 같으니 열린 칸의 폭은 `높이 × 사진비율`로 정해진다.
 * 가장 넓은 사진이 안쪽 폭의 절반을 차지하도록 상자 폭을 잡아두면,
 * 그보다 좁은 사진(아카이브)은 자기 비율만큼만 열리고 나머지는 옆 칸이 가져간다.
 * 임의로 정한 비율이 아니라 이미지가 정하는 값이다.
 */
const WIDEST = Math.max(
  ...mainSections.map((s) => (s.image ? s.image.width / s.image.height : 0)),
);

export default function MainPage() {
  return (
    <div data-screen="main" className="flex h-dvh items-center p-[var(--page-margin)]">
      <div
        className="mx-auto w-full"
        style={{
          height: `${HEIGHT_DVH}dvh`,
          maxWidth: `calc(${HEIGHT_DVH}dvh * ${WIDEST / OPEN_RATIO} + ${
            GAP * (mainSections.length - 1)
          }px)`,
        }}
      >
        <AccordionGallery
          items={mainSections.map((s) => ({
            label: s.label,
            href: s.href,
            image: s.image,
          }))}
          defaultIndex={0}
          orientation="horizontal"
          height="100%"
          gap={GAP}
          expandRatio={OPEN_RATIO}
          fitOpen
          trigger="hover"
          // 열린 칸의 폭은 대략 `높이 × 사진비율`이다. srcset은 이 값으로 고른다
          sizes={`(max-width: 520px) 100vw, ${Math.round(HEIGHT_DVH * WIDEST)}vh`}
        />
      </div>
    </div>
  );
}
