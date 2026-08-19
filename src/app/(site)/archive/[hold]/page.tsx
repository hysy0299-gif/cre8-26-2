import { notFound } from "next/navigation";
import { getHold, getNextHold, holds } from "@/data/holds";

/** 홀드가 늘어도 이 파일은 그대로 — 데이터만 추가하면 정적 생성된다 */
export function generateStaticParams() {
  return holds.map((h) => ({ hold: h.slug }));
}

/**
 * HOLD DETAIL — 모든 홀드가 공유하는 단일 템플릿.
 * Fabrication은 프로세스 내용을 복제하지 않고 hold.processRefs로 /process#key에 연결한다.
 */
export default async function HoldDetailPage({ params }: PageProps<"/archive/[hold]">) {
  const { hold: slug } = await params;
  const hold = getHold(slug);
  if (!hold) notFound();

  const next = getNextHold(slug);

  return (
    <>
      <section data-block="object-hero" aria-label="Object" />
      <section data-block="form" aria-label="Form" />
      <section data-block="cmf" aria-label="CMF" />
      <section data-block="surface" aria-label="Surface detail" />
      <section data-block="fabrication" aria-label="Fabrication" />
      <section data-block="interaction" aria-label="Interaction" />
      <section data-block="experiment" aria-label="Experiment images" />
      {next ? <section data-block="next-hold" aria-label="Next hold" /> : null}
    </>
  );
}
