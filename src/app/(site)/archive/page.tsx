import { sortedHolds } from "@/data/holds";

/**
 * HOLD ARCHIVE — 홀드 탐색.
 * product grid가 아니라 샘플 인덱스로 읽혀야 하므로
 * 카드는 이미지 + spec(form/material/surface/interaction)을 함께 노출한다.
 * 필터 축은 홀드 수와 변수 확정 후 결정한다.
 */
export default function ArchivePage() {
  const holds = sortedHolds();

  return (
    <>
      <section data-block="index-header" aria-label="Index" />
      <section data-block="hold-grid" aria-label="Holds">
        {holds.length === 0 ? null : null}
      </section>
    </>
  );
}
