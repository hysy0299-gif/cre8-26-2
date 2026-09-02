import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 화면을 나눠 갖고, 커서를 올린 칸이 열린다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 *
 * 상자에 비율을 따로 주지 않는다 — 여백을 뺀 화면이 그대로 상자다.
 * 열린 칸의 폭만 그 칸 사진의 원본 비율에서 나온다(AccordionGallery의 fitOpen).
 */
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
        defaultIndex={0}
        orientation="horizontal"
        height="100%"
        gap={GAP}
        fitOpen
        trigger="hover"
        // 사진은 원본 색 그대로 내보낸다 — 흑백도, 바탕색 워시도 걸지 않는다
        grayscale={false}
        dim={0}
        sizes="(max-width: 520px) 100vw, 40vw"
      />
    </div>
  );
}
