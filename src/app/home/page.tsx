import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 *
 * 세 칸이 화면을 세로로 나눠 갖고, 커서를 올린 칸이 열린다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 *
 * 박스 비율(2.6:1)은 사진에서 나온 값이다.
 * 세 사진이 세로 0.55~0.70 비율이라, 접힌 칸(전체의 25%)이 그 정도로 떨어지려면
 * 전체가 가로로 2.6배쯤 되어야 한다. 화면 높이를 다 쓰면 칸이 너무 길쭉해진다.
 */
const BOX_RATIO = 2.6;
const MAX_H_DVH = 74;

export default function MainPage() {
  return (
    <div data-screen="main" className="flex h-dvh items-center p-[var(--page-margin)]">
      <div
        className="mx-auto w-full"
        style={{
          aspectRatio: `${BOX_RATIO}`,
          maxWidth: `calc(${MAX_H_DVH}dvh * ${BOX_RATIO})`,
        }}
      >
        <AccordionGallery
          items={mainSections.map((s) => ({ label: s.label, href: s.href, image: s.image }))}
          defaultIndex={0}
          orientation="horizontal"
          height="100%"
          expandRatio={0.5}
          trigger="hover"
        />
      </div>
    </div>
  );
}
