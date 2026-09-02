import { HoldWheel } from "@/components/hold-wheel";
import { sortedHolds } from "@/data/holds";

/**
 * ARCHIVE — CMF가 서로 다른 홀드들의 아카이빙.
 *
 * 상단에 제목을 두지 않는다. 어느 화면인지는 왼쪽 휠이 이미 말해주고,
 * 이 페이지의 주인공은 홀드다.
 */
export default function ArchivePage() {
  return (
    <section data-screen="archive" data-block="archive" className="pl-[var(--archive-shift)]">
      <h1 className="sr-only">Archive</h1>
      <HoldWheel holds={sortedHolds()} />
    </section>
  );
}
