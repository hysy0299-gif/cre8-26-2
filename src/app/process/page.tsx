import { processStages } from "@/data/process";

/**
 * PROCESS — 단일 페이지, 스테이지별 앵커(/process#modeling).
 * timeline이 아니라 실험 아카이브로 보이도록 스테이지마다 독립 갤러리를 갖는다.
 */
export default function ProcessPage() {
  return (
    <>
      <section data-block="process-header" aria-label="Process" />
      {processStages.map((stage) => (
        <section key={stage.key} id={stage.key} data-block="stage" aria-label={stage.title} />
      ))}
    </>
  );
}
