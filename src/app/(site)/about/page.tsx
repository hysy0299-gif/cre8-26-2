import { Slot, SectionLabel } from "@/components/wireframe";

/** ABOUT — 팀 / 전시. */
export default function AboutPage() {
  return (
    <>
      <section data-block="definition" className="page-grid">
        <h1 className="text-display col-span-8">About</h1>
        <p className="text-lead col-span-8">
          Short project definition. Two or three sentences.
        </p>
      </section>

      <section data-block="team">
        <SectionLabel>Team</SectionLabel>
        <ul className="grid grid-cols-2 gap-x-[var(--grid-gutter)] gap-y-[var(--section-gap)] md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="flex flex-col gap-4">
              <Slot label={`Member ${String(i + 1).padStart(2, "0")}`} ratio="3/4" />
              <div className="text-label uppercase">
                <p>Name</p>
                <p className="text-ink-muted">Role</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section data-block="exhibition">
        <SectionLabel>Exhibition</SectionLabel>
        <div className="page-grid mb-[var(--grid-gutter)]">
          <p className="text-lead col-span-6">Venue, dates.</p>
        </div>
        <div className="grid grid-cols-2 gap-[var(--grid-gutter)] md:grid-cols-3">
          <Slot label="Install 01" ratio="16/9" className="md:col-span-3" />
          {Array.from({ length: 3 }, (_, i) => (
            <Slot key={i} label={`Install ${String(i + 2).padStart(2, "0")}`} ratio="4/3" />
          ))}
        </div>
      </section>

      <section data-block="contact" className="page-grid">
        <div className="col-span-4">
          <SectionLabel>Contact</SectionLabel>
          <p className="text-body text-ink-muted">Email.</p>
        </div>
      </section>
    </>
  );
}
