import { Slot } from "@/components/wireframe";

/** VISUAL — 비주얼 아카이브 / 전시 기록. 범위는 확정 후 채운다. */
export default function VisualPage() {
  return (
    <>
      <section data-block="visual-header" className="page-grid">
        <h1 className="text-display col-span-8">Visual</h1>
        <p className="text-body text-ink-muted col-span-4 self-end">
          Exhibition documentation and image studies.
        </p>
      </section>

      <section data-block="visual-gallery" aria-label="Gallery">
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
