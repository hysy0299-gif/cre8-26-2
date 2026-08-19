import { PageFlip } from "@/components/page-flip";
import { bookPages } from "@/data/book";

/** 브랜드북 — 프로세스 한가운데 크게 놓는다 */
export function BrandBook() {
  return <PageFlip pages={bookPages} className="py-[var(--grid-gutter)]" />;
}
