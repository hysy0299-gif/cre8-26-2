import { MainWheelNav } from "@/components/main-wheel-nav";
import { destinations, site } from "@/data/site";

/**
 * MAIN — 메인화면(허브).
 * 로고타입/로고와 목적지 휠이 함께 있고, 여기서 각 화면으로 넘어간다.
 * 휠 오른쪽 비주얼 영역은 선택 중인 목적지의 대표 이미지 자리다(Component 단계).
 */
export default function MainPage() {
  return (
    <div data-screen="main" className="h-dvh">
      <section data-block="mark" aria-label="Logotype">
        {site.name}
      </section>

      <div data-block="wheel" className="h-full">
        <MainWheelNav destinations={destinations} />
      </div>

      <section data-block="preview" aria-label="Selected section visual" />
    </div>
  );
}
