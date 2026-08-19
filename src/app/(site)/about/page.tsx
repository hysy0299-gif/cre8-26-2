import { SectionLabel } from "@/components/wireframe";

/** ABOUT — 프로젝트 정의 / 팀 / 전시 정보. 최소 정보만. */
export default function AboutPage() {
  return (
    <>
      <section data-block="definition" className="page-grid">
        <h1 className="text-display col-span-8">About</h1>
        <p className="text-lead col-span-8">
          Project statement goes here. Two or three sentences on holds as tactile interfaces
          rather than sports equipment.
        </p>
      </section>

      <section data-block="team" className="page-grid">
        <div className="col-span-4">
          <SectionLabel>Team</SectionLabel>
          <p className="text-body text-ink-muted">Names and roles.</p>
        </div>
        <div className="col-span-4">
          <SectionLabel>Exhibition</SectionLabel>
          <p className="text-body text-ink-muted">Venue, dates.</p>
        </div>
        <div className="col-span-4">
          <SectionLabel>Contact</SectionLabel>
          <p className="text-body text-ink-muted">Email.</p>
        </div>
      </section>
    </>
  );
}
