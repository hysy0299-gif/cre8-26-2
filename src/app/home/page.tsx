import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 같은 높이로 화면을 가득 나눠 갖고, 커서를 올린 칸이 넓어진다.
 * 기울기는 없다 — 폭과 색만 움직인다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 */

/** 열린 칸이 안쪽 폭에서 차지할 비율 */
const OPEN_RATIO = 0.5;
const GAP = 10;

export default function MainPage() {
  return (
    <div data-screen="main" className="flex h-dvh items-stretch p-[var(--page-margin)]">
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
        sizes="(max-width: 520px) 100vw, 50vw"
      />
    </div>
  );
}
