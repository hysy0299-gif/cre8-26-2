import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 화면을 세로로 나눠 갖고, 커서를 올린 칸이 열린다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 */
export default function MainPage() {
  return (
    <div data-screen="main" className="h-dvh p-[var(--page-margin)]">
      <AccordionGallery
        items={mainSections.map((s) => ({ label: s.label, href: s.href }))}
        defaultIndex={0}
        orientation="horizontal"
        height="100%"
        expandRatio={0.52}
        trigger="hover"
      />
    </div>
  );
}
