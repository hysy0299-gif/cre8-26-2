import { HoldCard } from "@/components/hold-card";
import { sortedHolds } from "@/data/holds";

/**
 * ARCHIVE — CMF가 서로 다른 홀드들의 아카이빙.
 * product grid가 아니라 샘플 인덱스로 읽혀야 하므로 카드가 spec을 함께 보여준다.
 * 필터 축(material / surface)은 홀드 수와 변수 확정 후 붙인다.
 */
export default function ArchivePage() {
  const holds = sortedHolds();

  return (
    <>
      <section data-block="index-header" className="page-grid">
        <h1 className="text-display col-span-8">Archive</h1>
        <p className="text-body text-ink-muted col-span-4 self-end">
          {holds.length} holds. Same geometry, different colour, material and finish — each one a
          separate CMF sample.
        </p>
      </section>

      <section data-block="hold-grid" aria-label="Holds">
        <ul className="grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-[var(--section-gap)] md:grid-cols-3">
          {holds.map((hold) => (
            <li key={hold.slug}>
              <HoldCard hold={hold} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
