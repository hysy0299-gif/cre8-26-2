import { Slot, SectionLabel } from "@/components/wireframe";

/**
 * GRIT — 브랜드 방향성 / 비주얼 / 매니페스토.
 * 로고 사용규정 같은 아이덴티티 매뉴얼이 아니라, 이 프로젝트가 무엇을 보는지를 말하는 페이지다.
 */
export default function GritPage() {
  return (
    <>
      <section data-block="manifesto" className="page-grid">
        <p className="text-label text-ink-muted col-span-12">Manifesto</p>
        <h1 className="text-display col-span-12">
          A hold is not equipment.
          <br />
          It is a surface you meet with your hands.
        </h1>
        <p className="text-lead col-span-8 col-start-5">
          Manifesto body. Three or four lines on why indoor holds converged on one plastic and
          one texture, and what we are testing against that.
        </p>
      </section>

      <section data-block="direction">
        <SectionLabel>Direction</SectionLabel>
        <div className="page-grid">
          <Slot label="Key visual" ratio="16/9" className="col-span-12" />
        </div>
        <div className="page-grid mt-[var(--grid-gutter)]">
          {["Touch", "Material", "Standardisation"].map((label) => (
            <div key={label} className="col-span-4">
              <h3 className="text-title mb-3">{label}</h3>
              <p className="text-body text-ink-muted">
                One paragraph on this axis of the brand direction.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section data-block="visual">
        <SectionLabel>Visual</SectionLabel>
        <div className="grid grid-cols-2 gap-[var(--grid-gutter)] md:grid-cols-3">
          <Slot label="Image 01" ratio="4/5" className="md:col-span-2 md:row-span-2" />
          {Array.from({ length: 6 }, (_, i) => (
            <Slot key={i} label={`Image ${String(i + 2).padStart(2, "0")}`} ratio="1" />
          ))}
        </div>
      </section>
    </>
  );
}
