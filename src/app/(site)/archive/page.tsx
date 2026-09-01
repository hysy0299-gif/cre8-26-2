import { HoldWheel } from "@/components/hold-wheel";
import { sortedHolds } from "@/data/holds";

/**
 * ARCHIVE — CMF가 서로 다른 홀드들의 아카이빙.
 *
 * 헤더와 본문을 한 섹션에 묶는다.
 * 둘을 따로 두면 레이아웃의 --section-gap(최대 10rem)이 사이에 끼어
 * 화면이 통째로 아래로 밀린다.
 */
export default function ArchivePage() {
  const holds = sortedHolds();

  return (
    <section data-screen="archive" data-block="archive" className="flex flex-col gap-6">
      <div className="text-label text-ink-muted flex items-baseline justify-between uppercase">
        <h1>Archive</h1>
        <p>{holds.length} CMF samples</p>
      </div>

      <HoldWheel holds={holds} />
    </section>
  );
}
