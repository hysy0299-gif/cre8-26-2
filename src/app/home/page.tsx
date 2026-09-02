import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * React Bits AccordionGallery를 예시 프롭 그대로 세 칸에 건다.
 * 커서를 올린 칸이 열리고 나머지가 접힌다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 */

/** 열린 칸이 안쪽 폭에서 차지할 목표 비율. 예시 프롭의 expandRatio 값이다 */
const OPEN_RATIO = 0.52;

/**
 * 상자 비율은 사진에서 나온다.
 *
 * 칸 높이는 상자 높이와 같으니 열린 칸의 폭은 `높이 × 사진비율`로 정해진다.
 * 가장 넓은 사진이 열렸을 때 그 폭이 안쪽 폭의 OPEN_RATIO가 되도록 상자를 잡으면,
 * 어느 칸이 열려도 사진이 잘리지도 빈 띠가 생기지도 않는다.
 * 그 대신 상자가 화면보다 좁아져서 좌우에 여백이 남는다.
 */
const WIDEST = Math.max(
  ...mainSections.map((s) => (s.image ? s.image.width / s.image.height : 0)),
);

export default function MainPage() {
  return (
    <div data-screen="main" className="flex h-dvh items-center justify-center p-[var(--page-margin)]">
      <div className="h-full max-w-full" style={{ aspectRatio: `${WIDEST / OPEN_RATIO}` }}>
        <AccordionGallery
          items={mainSections.map((s) => ({
            label: s.label,
            href: s.href,
            image: s.image,
          }))}
          defaultIndex={3}
          expandRatio={OPEN_RATIO}
          fitOpen
          trigger="hover"
          accentColor="#000000"
          overlayColor="#282828"
          duration={0.75}
          // 예시는 0.85지만 0이다. 미끄러지려면 사진을 칸보다 넓게 깔아야 하고,
          // 그러면 세로로 긴 사진이 위아래로 크게 잘린다 — 안 자르기로 한 것과 같이 못 간다
          parallax={0}
          gap={8}
          radius={10}
          height="100%"
        />
      </div>
    </div>
  );
}
