import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 같은 높이로 나란히 서고, 커서를 올린 칸이 넓어진다.
 * 기울기는 없다 — 폭과 색만 움직인다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 */

/** 열린 칸이 안쪽 폭에서 차지할 목표 비율 */
const OPEN_RATIO = 0.5;
const GAP = 10;

/**
 * 상자 비율은 사진에서 나온다.
 *
 * 칸 높이는 상자 높이와 같으니 열린 칸의 폭은 `높이 × 사진비율`로 정해진다.
 * 상자를 화면 가로에 꽉 채우면 그 폭이 1/3보다도 좁아져서 아코디언이 아예 안 벌어진다.
 * 가장 넓은 사진이 열렸을 때 안쪽 폭의 OPEN_RATIO가 되도록 상자를 잡으면,
 * 사진은 잘리지 않으면서 열린 칸이 확실히 넓어진다. 대신 좌우에 여백이 남는다.
 */
const WIDEST = Math.max(
  ...mainSections.map((s) => (s.image ? s.image.width / s.image.height : 0)),
);

export default function MainPage() {
  return (
    <div
      data-screen="main"
      className="flex h-dvh items-center justify-center p-[var(--page-margin)]"
    >
      <div className="h-full max-w-full" style={{ aspectRatio: `${WIDEST / OPEN_RATIO}` }}>
        <AccordionGallery
          items={mainSections.map((s) => ({
            label: s.label,
            href: s.href,
            image: s.image,
          }))}
          defaultIndex={1}
          orientation="horizontal"
          height="100%"
          gap={GAP}
          expandRatio={OPEN_RATIO}
          fitOpen
          // 기울이지 않는다 — 세 칸이 같은 높이로 나란히 선다
          tilt={0}
          trigger="hover"
          sizes="(max-width: 520px) 100vw, 40vw"
        />
      </div>
    </div>
  );
}
