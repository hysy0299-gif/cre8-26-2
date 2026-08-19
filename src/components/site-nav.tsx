import Link from "next/link";
import { Logo } from "@/components/logo";
import { nav } from "@/data/site";

/**
 * 내부 페이지 전역 네비게이션.
 * 고정 여부와 스크롤 동작은 Interaction 단계에서 정한다 — 지금은 문서 흐름에 둔다.
 */
export function SiteNav() {
  return (
    <nav className="page-inset flex items-center justify-between py-[var(--page-margin)]">
      <Link href="/home" aria-label="GRIT — home">
        <Logo variant="symbol" className="h-5 w-auto text-ink" />
      </Link>
      <ul className="text-label flex gap-[var(--grid-gutter)] uppercase">
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
