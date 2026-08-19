import Link from "next/link";
import { nav, site } from "@/data/site";

/**
 * 전역 네비게이션 — 구조 스텁.
 * 오버레이/고정 여부, 타이포, 간격은 Layout·Design System 단계에서 정한다.
 */
export function SiteNav() {
  return (
    <nav>
      <Link href="/">{site.name}</Link>
      <ul>
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
