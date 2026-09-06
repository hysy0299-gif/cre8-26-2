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
 * 화살표만 fixed로 띄운다. GRIT 매니페스토와 프로세스 북은 화면 몇 개 분량을
 * 스크롤하는데, 흐름에 두면 첫 화면에서만 보이고 이후로는 사라져서
 * 중간에 들어온 사람이 나갈 길을 잃는다.
 * 바깥 nav는 흐름에 그대로 남겨둔다 — 아카이브가 이 높이를 재서
 * 휠과 홀드의 세로 중심을 잡기 때문에, 걷어내면 그 계산이 어긋난다.
 *
 * 오른쪽 링크 글씨는 화면 하나가 통째로 인터랙션인 페이지에서 감춘다
 * (globals의 data-bare-nav / data-screen="archive" 규칙).
 * 감추기만 하고 지우지는 않아서 키보드로는 여전히 닿는다.
 */
export function SiteNav() {
  return (
    <nav className="page-inset flex items-center justify-end py-[var(--nav-pad)]">
      <div className="fixed top-[var(--nav-pad)] left-[var(--page-margin)] z-50">
        <BackLink href="/home" label="Back to main" />
      </div>

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
