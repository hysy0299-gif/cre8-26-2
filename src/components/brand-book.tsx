import Image from "next/image";
import { bookPages } from "@/data/book";

/**
 * 브랜드북.
 *
 * ⚠ 임시 구현 — React Bits Pro의 Page Flip이 들어갈 자리다.
 * 라이선스 키(REACTBITS_LICENSE_KEY)가 없어 아직 설치를 못 했다.
 * 지금은 가로 스크롤 스트립으로 페이지 순서와 비율만 확인할 수 있게 해뒀고,
 * 키가 들어오면 이 컴포넌트 안쪽만 갈아끼우면 된다 — 데이터(bookPages)는 그대로 쓴다.
 */
export function BrandBook() {
  return (
    <div className="-mx-[var(--page-margin)] overflow-x-auto">
      <ul className="flex w-max gap-[var(--grid-gutter)] px-[var(--page-margin)]">
        {bookPages.map((page, i) => (
          <li key={page.src} className="flex flex-col gap-3">
            <Image
              src={page.src}
              alt={page.alt}
              width={page.width}
              height={page.height}
              sizes="(max-width: 768px) 60vw, 32vw"
              className="border-ink-muted/40 h-[52vh] w-auto border"
            />
            <span className="text-label text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
