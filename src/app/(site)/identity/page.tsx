import { Logo } from "@/components/logo";
import { Slot, SectionLabel } from "@/components/wireframe";

/** IDENTITY — 로고타입 / 로고 / 아이덴티티 시스템. */
export default function IdentityPage() {
  return (
    <>
      <section data-block="identity-header" className="page-grid">
        <h1 className="text-display col-span-8">Identity</h1>
      </section>

      <section data-block="logotype">
        <SectionLabel>Logotype</SectionLabel>
        <Logo variant="wordmark" className="text-ink w-full" />
      </section>

      <section data-block="logo">
        <SectionLabel>Symbol</SectionLabel>
        <div className="page-grid">
          <Logo variant="symbol" className="text-ink col-span-3 w-full" />
          <p className="text-body text-ink-muted col-span-5 self-end">
            Construction, clear space and minimum size go here.
          </p>
        </div>
      </section>

      <section data-block="system">
        <SectionLabel>Colour</SectionLabel>
        <ul className="grid grid-cols-2 gap-[var(--grid-gutter)] md:grid-cols-4">
          {[
            { name: "GRIT White", hex: "#F5F5F5", className: "bg-grit-white" },
            { name: "GRIT Black", hex: "#010101", className: "bg-grit-black" },
            { name: "GRIT Mid", hex: "#AEB6BF", className: "bg-grit-mid" },
            { name: "GRIT Green", hex: "#CBD7D4", className: "bg-grit-green" },
          ].map((swatch) => (
            <li key={swatch.hex} className="flex flex-col gap-3">
              <div className={`border-ink-muted/50 aspect-square border ${swatch.className}`} />
              <div className="text-label uppercase">
                <p>{swatch.name}</p>
                <p className="text-ink-muted">{swatch.hex}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section data-block="applications">
        <SectionLabel>Applications</SectionLabel>
        <div className="grid grid-cols-2 gap-[var(--grid-gutter)] md:grid-cols-3">
          {["Packaging", "Print", "Exhibition"].map((label) => (
            <Slot key={label} label={label} ratio="4/3" />
          ))}
        </div>
      </section>
    </>
  );
}
