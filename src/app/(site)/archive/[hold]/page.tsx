import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Slot, SectionLabel } from "@/components/wireframe";
import { getHold, getNextHold, holds } from "@/data/holds";

/** 홀드가 늘어도 이 파일은 그대로 — 데이터만 추가하면 정적 생성된다 */
export function generateStaticParams() {
  return holds.map((h) => ({ hold: h.slug }));
}

const SPEC_KEYS = ["form", "material", "surface", "interaction"] as const;

/** 모든 홀드가 공유하는 단일 상세 템플릿 */
export default async function HoldDetailPage({ params }: PageProps<"/archive/[hold]">) {
  const { hold: slug } = await params;
  const hold = getHold(slug);
  if (!hold) notFound();

  const next = getNextHold(slug);

  return (
    <>
      <section data-block="object-hero" className="page-grid">
        <div className="col-span-12 md:col-span-7">
          {hold.hero ? (
            <Image
              src={hold.hero.src}
              alt={hold.hero.alt}
              width={hold.hero.width}
              height={hold.hero.height}
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            <Slot label={hold.index} ratio="4/5" />
          )}
        </div>
        <div className="col-span-12 flex flex-col justify-end gap-8 md:col-span-5">
          <h1 className="text-title">{hold.name}</h1>
          <dl className="text-label grid grid-cols-[6rem_1fr] gap-y-2 uppercase">
            {SPEC_KEYS.map((key) => (
              <div key={key} className="contents">
                <dt className="text-ink-muted">{key}</dt>
                <dd>{hold.spec[key]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section data-block="form">
        <SectionLabel>Form</SectionLabel>
        <div className="page-grid">
          <Slot label="Form study" ratio="1" className="col-span-6" />
          <Slot label="Silhouette / section" ratio="1" className="col-span-6" />
        </div>
      </section>

      <section data-block="cmf">
        <SectionLabel>CMF</SectionLabel>
        <div className="page-grid">
          <Slot label="Colour" ratio="1" className="col-span-4" />
          <Slot label="Material" ratio="1" className="col-span-4" />
          <Slot label="Finish" ratio="1" className="col-span-4" />
        </div>
      </section>

      <section data-block="surface">
        <SectionLabel>Surface detail</SectionLabel>
        <Slot label="Macro surface" ratio="21/9" note="Close range. Texture is the subject." />
      </section>

      <section data-block="fabrication">
        <SectionLabel>Fabrication</SectionLabel>
        <div className="page-grid">
          <Slot label="Making" ratio="3/2" className="col-span-8" />
          <p className="text-body text-ink-muted col-span-4 self-end">
            Links out to the shared process archive instead of repeating it here.{" "}
            <Link href="/process" className="text-ink underline underline-offset-4">
              Process →
            </Link>
          </p>
        </div>
      </section>

      <section data-block="interaction">
        <SectionLabel>Interaction</SectionLabel>
        <Slot label="Sensor / grip response" ratio="16/9" />
      </section>

      <section data-block="experiment">
        <SectionLabel>Experiment images</SectionLabel>
        <div className="grid grid-cols-2 gap-[var(--grid-gutter)] md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Slot key={i} label={`Test ${i + 1}`} ratio="1" />
          ))}
        </div>
      </section>

      {next ? (
        <section data-block="next-hold" className="border-ink-muted/50 border-t pt-8">
          <Link href={`/archive/${next.slug}`} className="flex items-baseline justify-between">
            <span className="text-label text-ink-muted uppercase">Next</span>
            <span className="text-title">{next.name} →</span>
          </Link>
        </section>
      ) : null}
    </>
  );
}
