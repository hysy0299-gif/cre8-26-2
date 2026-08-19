import { HoldWheel } from "@/components/hold-wheel";
import { sortedHolds } from "@/data/holds";

/**
 * ARCHIVE — CMF가 서로 다른 홀드들의 아카이빙.
 * 왼쪽 키워드 휠을 돌리면 오른쪽 오브제가 바뀐다. 확정하면 상세로 들어간다.
 */
export default function ArchivePage() {
  const holds = sortedHolds();

  return (
    <>
      <section data-block="index-header" className="page-grid">
        <h1 className="text-display col-span-8">Archive</h1>
        <p className="text-body text-ink-muted col-span-4 self-end">
          {holds.length} holds. Same intent, different colour, material and finish — each one a
          separate CMF sample.
        </p>
      </section>

      <section data-block="hold-wheel" aria-label="Holds">
        <HoldWheel holds={holds} />
      </section>
    </>
  );
}
