import { HoldWheel } from "@/components/hold-wheel";
import { sortedHolds } from "@/data/holds";

/**
 * ARCHIVE — CMF가 서로 다른 홀드들의 아카이빙.
 *
 * 타이틀은 작게 위로 올리고 화면 대부분을 휠과 오브제에 내준다.
 * 이 페이지의 주인공은 제목이 아니라 홀드다.
 */
export default function ArchivePage() {
  const holds = sortedHolds();

  return (
    <>
      <section
        data-block="index-header"
        className="text-label text-ink-muted flex items-baseline justify-between uppercase"
      >
        <h1>Archive</h1>
        <p>{holds.length} CMF samples</p>
      </section>

      <section data-block="hold-wheel" aria-label="Holds">
        <HoldWheel holds={holds} />
      </section>
    </>
  );
}
