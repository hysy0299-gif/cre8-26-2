import { SiteNav } from "@/components/site-nav";

/**
 * 내부 페이지 레이아웃 — 좌우 여백과 섹션 리듬만 여기서 준다.
 * 랜딩(/)과 메인화면(/home)은 각자 자기 진입 장치를 갖고 있어 이 그룹에서 제외한다.
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
