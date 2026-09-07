import { ScrollBurnText } from "@/components/scroll-burn-text";
import { MANIFESTO } from "@/data/manifesto";

/**
 * GRIT — 매니페스토.
 *
 * 스크롤을 내리면 문단이 다가와 읽히고, GRIT 심볼 모양으로 타들어가며 사라진다.
 * 사라진 자리에서 다음 문단이 올라온다.
 *
 * 같은 인터랙션이 첫 화면(/)에도 붙었다 — 전시장에서 처음 들어온 사람은
 * 여기까지 오기 전에 이미 읽는다. 이 페이지는 3분할에서 GRIT 칸을 눌러
 * 다시 보러 오는 자리다. 글은 @/data/manifesto 한 벌을 같이 쓴다.
 */
export default function GritPage() {
  return (
    <section data-block="manifesto" data-bare-nav>
      <h1 className="sr-only">GRIT — Manifesto</h1>
      <ScrollBurnText sections={MANIFESTO} logoOutro hint="scroll" />
    </section>
  );
}
