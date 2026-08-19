import { MainScreen } from "@/components/main-screen";
import { Logo } from "@/components/logo";
import { destinations } from "@/data/site";

/**
 * MAIN — 메인화면(허브). 한 화면에 고정, 페이지 스크롤 없음.
 * 좌 5칸 휠 / 우 7칸 선택 중인 목적지 비주얼.
 */
export default function MainPage() {
  return (
    <div data-screen="main" className="flex h-dvh flex-col overflow-hidden">
      <header className="page-inset flex shrink-0 items-start justify-between pt-[var(--page-margin)]">
        <Logo variant="lockup" className="w-[clamp(5rem,9vw,10rem)] text-ink" />
        <p className="text-label text-ink-muted max-w-[22ch] text-right uppercase">
          Climbing holds as tactile interfaces
        </p>
      </header>

      <MainScreen destinations={destinations} />

      <footer className="page-inset text-label text-ink-muted flex shrink-0 items-end justify-between pb-[var(--page-margin)] uppercase">
        <span>Scroll or drag to select</span>
        <span>CRE8 26-2</span>
      </footer>
    </div>
  );
}
