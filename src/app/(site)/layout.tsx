import { SiteNav } from "@/components/site-nav";

/**
 * 내부 페이지 레이아웃 — 좌우 여백과 섹션 리듬만 여기서 준다.
 * 3분할(/)과 GRIT(/grit)은 화면 하나가 통째로 인터랙션이라 이 그룹에서 제외한다.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteNav />
      <main className="page-inset flex flex-col gap-[var(--section-gap)] pb-[var(--section-gap)]">
        {children}
      </main>
    </>
  );
}
