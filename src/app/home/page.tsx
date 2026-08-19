import { MainWheelNav } from "@/components/main-wheel-nav";
import { Logo } from "@/components/logo";
import { destinations } from "@/data/site";

/**
 * MAIN — 메인화면(허브). 한 화면에 고정, 페이지 스크롤 없음.
 *
 * 좌 5칸: 목적지 휠. 왼쪽으로 full-bleed라 커브가 화면 가장자리까지 파고든다.
 *         가운데 항목의 여백은 휠의 inset(= --page-margin)이 만든다.
 * 우 7칸: 선택 중인 목적지의 대표 이미지 자리 (Component 단계에서 채운다).
 */
export default function MainPage() {
  return (
    <div data-screen="main" className="flex h-dvh flex-col overflow-hidden">
      <header className="page-inset shrink-0 pt-[var(--page-margin)]">
        <Logo variant="lockup" className="w-[clamp(5rem,9vw,10rem)] text-ink" />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-12 gap-[var(--grid-gutter)] pr-[var(--page-margin)]">
        <div data-block="wheel" className="col-span-12 min-h-0 md:col-span-5">
          <MainWheelNav destinations={destinations} />
        </div>

        <section
          data-block="preview"
          aria-label="Selected section visual"
          className="col-span-7 hidden min-h-0 md:block"
        />
      </div>

      <footer
        data-block="meta"
        className="page-inset text-label shrink-0 pb-[var(--page-margin)] text-ink-muted uppercase"
      />
    </div>
  );
}
