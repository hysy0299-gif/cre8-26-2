import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * React Bits AccordionGallery를 프롭 그대로 세 칸에 건다.
 * 커서를 올린 칸이 열리고 나머지가 접힌다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 *
 * 가운데(ARCHIVE)를 열어둔 채 시작한다 — 세 칸이라 가운데가 1번이고,
 * 그 상태에서 좌우 칸이 대칭으로 눕는다.
 */
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
        height="100%"
        expandRatio={0.52}
        trigger="hover"
        accentColor="#000000"
        overlayColor="#282828"
        duration={0.75}
        parallax={0.85}
        gap={8}
        radius={10}
      />
    </div>
  );
}
