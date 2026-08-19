import Link from "next/link";
import { Logo } from "@/components/logo";
import { Slot } from "@/components/wireframe";

/**
 * LANDING — 진입 화면. 한 화면 고정, 여기서 메인화면(/home)으로 넘어간다.
 * 워드마크를 폭 전체로 눕혀 첫 화면을 타이포 하나로 잡는다.
 */
export default function LandingPage() {
  return (
    <div
      data-screen="landing"
      className="page-inset flex h-dvh flex-col justify-between gap-[var(--page-margin)] py-[var(--page-margin)]"
    >
      <header className="text-label text-ink-muted flex shrink-0 items-start justify-between uppercase">
        <span>GRIT</span>
        <span>CMF / Interaction research</span>
      </header>

      <Slot
        label="Landing visual"
        note="Hero object or motion. Fills the space above the wordmark."
        className="min-h-0 flex-1"
      />

      <section data-block="landing-mark" aria-label="Wordmark" className="shrink-0">
        <Logo variant="lockup" className="w-full text-ink" />
      </section>

      <footer className="text-label flex shrink-0 items-end justify-between uppercase">
        <Link href="/home" data-block="enter" className="text-ink hover:text-ink-muted">
          Enter →
        </Link>
        <span className="text-ink-muted">2026</span>
      </footer>
    </div>
  );
}
