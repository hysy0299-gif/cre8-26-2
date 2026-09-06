import Link from "next/link";
import { BackLink } from "@/components/back-link";
import { nav } from "@/data/site";

/**
 * 내부 페이지 전역 네비게이션.
 *
 * 왼쪽 위는 뒤로가기다 — 메인화면(3분할)으로 돌아간다.
 * 예전엔 심볼이 그 자리에서 같은 곳으로 갔는데, 전시장에서는 로고가
 * 돌아가는 길로 안 읽힌다. 화살표가 할 일을 더 분명히 말한다.
 *
 * 오른쪽 링크 글씨는 화면 하나가 통째로 인터랙션인 페이지에서 감춘다
 * (globals의 data-bare-nav / data-screen="archive" 규칙).
 * 감추기만 하고 지우지는 않아서 키보드로는 여전히 닿는다.
 */
export function SiteNav() {
  return (
    <nav className="page-inset flex items-center justify-between py-[var(--nav-pad)]">
      <BackLink href="/home" label="Back to main" />
      <ul data-nav-links className="text-label flex gap-[var(--grid-gutter)] uppercase">
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
