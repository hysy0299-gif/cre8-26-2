import { BrandBook } from "@/components/brand-book";

/**
 * PROCESS — 프로세스 북.
 *
 * 지금은 책 인터랙션 하나만 둔다. 제목·설명과 스테이지별 회색 슬롯은
 * 내용이 확정되기 전까지 화면만 어지럽혀서 걷어냈다.
 */
export default function ProcessPage() {
  return (
    <section data-block="brand-book">
      <h1 className="sr-only">Process</h1>
      <BrandBook />
    </section>
  );
}
