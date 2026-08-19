import Link from "next/link";
import { Logo } from "@/components/logo";

/**
 * LANDING — 진입 화면. 한 화면 고정, 여기서 메인화면(/home)으로 넘어간다.
 *
 * 워드마크를 폭 전체로 눕혀 첫 화면을 타이포 하나로 잡는다.
 * 위쪽 비주얼 슬롯과 진입 연출(reveal / 전환)은 Interaction 단계에서 채운다.
 */
export default function LandingPage() {
  return (
    <div
      data-screen="landing"
      className="page-inset flex h-dvh flex-col justify-between py-[var(--page-margin)]"
    >
      <section data-block="landing-visual" aria-label="Landing visual" className="min-h-0 flex-1" />

      <section data-block="landing-mark" aria-label="Wordmark" className="shrink-0">
        <Logo variant="lockup" className="w-full text-ink" />
      </section>

      <footer className="text-label flex shrink-0 items-end justify-between pt-[var(--page-margin)] uppercase">
        <Link href="/home" data-block="enter" className="text-ink hover:text-ink-muted">
          Enter
        </Link>
      </footer>
    </div>
  );
}
