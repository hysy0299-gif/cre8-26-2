import { BrandBook } from "@/components/brand-book";
import { Slot, SectionLabel } from "@/components/wireframe";
import { processStages } from "@/data/process";

/**
 * PROCESS — 브랜드북 + 제작 과정.
 * 스테이지는 timeline이 아니라 실험 아카이브로 보이도록 각자 독립 갤러리를 갖는다.
 */
export default function ProcessPage() {
  return (
    <>
      <section data-block="process-header" className="page-grid">
        <h1 className="text-display col-span-8">Process</h1>
        <p className="text-body text-ink-muted col-span-4 self-end">
          Brand book and the making of the holds. Not a timeline — each stage is its own set of
          experiments.
        </p>
      </section>

      <section data-block="brand-book">
        <SectionLabel>Brand book</SectionLabel>
        <BrandBook />
      </section>

      {processStages.map((stage, i) => (
        <section key={stage.key} id={stage.key} data-block="stage">
          <div className="mb-6 flex items-baseline justify-between">
            <SectionLabel>{stage.title}</SectionLabel>
            <span className="text-label text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <div className="grid grid-cols-2 gap-[var(--grid-gutter)] md:grid-cols-4">
            {Array.from({ length: 4 }, (_, j) => (
              <Slot key={j} label={`${stage.title} ${j + 1}`} ratio="1" />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
