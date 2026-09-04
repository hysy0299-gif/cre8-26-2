import { ScrollBurnText } from "@/components/scroll-burn-text";

/**
 * GRIT — 매니페스토.
 *
 * 스크롤을 내리면 문단이 다가와 읽히고, GRIT 심볼 모양으로 타들어가며 사라진다.
 * 사라진 자리에서 다음 문단이 올라온다.
 *
 * 문단마다 앞 문장이 주장이고 뒤가 근거다 — 현상 → 관점 → 목표 순.
 */
const MANIFESTO = [
  "Climbing holds have settled into a familiar language of bright colors, synthetic materials, and functional forms. As shapes and materials are repeated, visual and tactile differences begin to disappear. What was once a direct encounter between the body and the wall has been reduced to a simple function: something to grab.",
  "GRIT looks at the hold differently. We see the climbing hold not simply as equipment, but as a tactile interface between the body and its environment. Through experiments with materials, surfaces, textures, and forms, we explore how a hold can communicate beyond its function. Roughness, softness, temperature, weight, and resistance become part of the climbing experience.",
  "We believe climbing can be experienced beyond movement. GRIT creates holds that invite the body to observe, touch, and respond. By introducing unfamiliar materials and sensations into climbing, we explore new possibilities for the hold—and offer a wider range of sensory experiences.",
];

export default function GritPage() {
  return (
    <section data-block="manifesto">
      <h1 className="sr-only">GRIT — Manifesto</h1>
      <ScrollBurnText sections={MANIFESTO} logoOutro hint="scroll" />
    </section>
  );
}
