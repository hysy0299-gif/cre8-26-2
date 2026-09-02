import Link from "next/link";
import { Logo } from "@/components/logo";
import { nav } from "@/data/site";

/**
 * 내부 페이지 전역 네비게이션.
 *
 * 아카이브에서는 링크 글씨를 감추고 심볼만 남긴다 — 화면 위쪽을 비워두기 위해서다.
 * 감추는 건 CSS(globals의 data-screen="archive" 규칙)라서 마크업은 그대로고,
 * 키보드·스크린리더로는 여전히 닿는다.
 */
export function SiteNav() {
  return (
    <nav className="page-inset flex items-center justify-between py-[var(--nav-pad)]">
      <Link href="/home" aria-label="GRIT — home">
        <Logo variant="symbol" className="text-ink h-5 w-auto" />
      </Link>
      <ul
        data-nav-links
        className="text-label flex gap-[var(--grid-gutter)] uppercase"
      >
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-ink-muted hover:text-ink">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
