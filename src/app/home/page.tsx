import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 화면을 가득 채운다. 여백도 칸 사이 간격도 없다 —
 * 사진 세 장이 곧 화면이고, 커서를 올린 칸이 열린다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 *
 * 상자에 비율을 따로 주지 않는다. 열린 칸의 폭만 그 칸 사진의
 * 원본 비율에서 나온다(AccordionGallery의 fitOpen) — 펼쳐진 사진은 안 잘린다.
 */
export default function MainPage() {
  return (
    <div data-screen="main" className="h-dvh w-screen">
      <AccordionGallery
        items={mainSections.map((s) => ({
          label: s.label,
          href: s.href,
          image: s.image,
        }))}
        defaultIndex={0}
        orientation="horizontal"
        height="100%"
        gap={0}
        fitOpen
        trigger="hover"
        sizes="(max-width: 520px) 100vw, 40vw"
      />
    </div>
  );
}
