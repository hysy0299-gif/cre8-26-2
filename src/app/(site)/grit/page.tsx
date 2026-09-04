import { ScrollBurnText } from "@/components/scroll-burn-text";

/**
 * GRIT — 매니페스토.
 *
 * 스크롤을 내리면 문단이 다가와 읽히고, GRIT 심볼 모양으로 타들어가며 사라진다.
 * 사라지는 자리에서 다음 문단이 올라온다.
 *
 * 아래 세 문단은 인터랙션을 보기 위한 자리글이다 — 브랜드북 원고가 나오면 갈아끼운다.
 */
const MANIFESTO = [
  "A climbing hold is not equipment. It is a surface you meet with your hands, and the only part of the wall that answers back. Everything we make starts from that contact and works outward.",
  "Indoor holds converged on one plastic and one grain. We take that convergence as the question, not the answer, and treat colour, material and finish as the experiment — cast, coated, torn, wrapped, left rough.",
  "Nothing here is a product line. It is an archive of surfaces, each one a record of what a hand found there. Read it with your eyes first. The rest is for your hands.",
];

export default function GritPage() {
  return (
    <section data-block="manifesto">
      <h1 className="sr-only">GRIT</h1>
      <ScrollBurnText sections={MANIFESTO} hint="scroll" />
    </section>
  );
}
