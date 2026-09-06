import Link from "next/link";

/**
 * 왼쪽 위 뒤로가기.
 *
 * 전시장에서 처음 보는 사람이 한 화면 안에 갇히지 않게 두는 표시다.
 * 글리프는 작지만 누르는 영역은 44px로 넉넉히 잡는다 — 손가락으로 눌러야 한다.
 * 음수 마진으로 그 여유분을 상쇄해서, 화살표 자체는 여백 선에 맞춰 선다.
 */
export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="text-ink hover:text-ink-muted -m-3 inline-flex h-11 w-11 items-center justify-center transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M15 4 7 12l8 8" />
      </svg>
    </Link>
  );
}
