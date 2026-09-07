"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { BackLink } from "@/components/back-link";
import { MorphingText, type MorphingTextHandle } from "@/components/morphing-text";
import { ScrollBurnText } from "@/components/scroll-burn-text";
import { ScrollExpand } from "@/components/scroll-expand";
import { MANIFESTO } from "@/data/manifesto";

/**
 * 첫 화면 = GRIT 파트. 매니페스토를 읽고 나서 벽이 열린다.
 *
 * 전시를 켜면 여기부터 보이고, 3분할의 GRIT 칸도 이리로 되돌아온다.
 * 그래서 뒤로가기가 여기 붙는다 — 3분할이 이 웹의 집이고, 여기는 그 안쪽 한 갈래다.
 *
 * 스크롤 한 줄에 두 인터랙션이 차례로 걸린다.
 * 1. 문단 셋이 다가와 읽히고 GRIT 심볼 모양으로 타 사라진 뒤, 그 자리에 로고가 선다.
 * 2. 이어 내리면 벽 사진 프레임이 열려 화면을 먹고, 같은 스크롤로
 *    "Be Experimental"이 "GRIT"으로 녹아 바뀐다. 다 열린 뒤 누르면 메인화면으로.
 *
 * 두 컴포넌트 모두 제 구간(runway/track)을 창 스크롤에 대고 재기 때문에,
 * 위아래로 쌓아두기만 하면 각자 제 차례에만 움직인다.
 * 매니페스토 쪽 sticky 무대가 불투명(bg-ground)이라 아래 벽이 비쳐 보이지도 않는다.
 */

/** 모핑을 스크롤 전 구간에 걸지 않는다 — 조금 내렸을 때 시작해 다 열리기 전에 끝난다 */
const MORPH_FROM = 0.15;
const MORPH_TO = 0.75;

/**
 * 여기까지 열려야 눌러서 들어갈 수 있다.
 *
 * 예전엔 화면 전체가 처음부터 링크라, 전시장에서 지나가다 한 번 스치면
 * 벽이 열리는 장면을 못 보고 바로 넘어가 버렸다.
 * 다 열린 뒤에만 링크를 건다.
 */
const ENTER_AT = 0.98;

export default function LandingPage() {
  const morphRef = useRef<MorphingTextHandle>(null);
  const [ready, setReady] = useState(false);
  /** 스크롤 프레임마다 setState를 부르지 않게, 넘나들 때만 바꾼다 */
  const readyRef = useRef(false);

  const handleProgress = useCallback((p: number) => {
    const t = (p - MORPH_FROM) / (MORPH_TO - MORPH_FROM);
    morphRef.current?.setProgress(Math.min(Math.max(t, 0), 1));

    const open = p >= ENTER_AT;
    if (open !== readyRef.current) {
      readyRef.current = open;
      setReady(open);
    }
  }, []);

  return (
    <div data-screen="landing" className="relative">
      {/* 긴 스크롤이라 흐름에 두면 첫 화면에서만 보인다. 화면에 고정해 둔다 */}
      <div className="fixed top-[var(--nav-pad)] left-[var(--page-margin)] z-50">
        <BackLink href="/home" label="Back to main" />
      </div>

      <section data-block="manifesto">
        <h1 className="sr-only">GRIT — Manifesto</h1>
        <ScrollBurnText sections={MANIFESTO} logoOutro hint="scroll" />
      </section>

      <ScrollExpand
        src="/img/landing-bg.webp"
        alt=""
        useWindowScroll
        startWidth={42}
        startHeight={58}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        overlayScrim={0}
        onProgress={handleProgress}
        overlay={
          <MorphingText
            ref={morphRef}
            from="Be Experimental"
            to="GRIT"
            className="text-ink h-[1.15em] text-[clamp(2rem,7vw,6.5rem)] font-bold tracking-tight"
          />
        }
        hint={<span className="text-label text-ink-muted uppercase">Scroll</span>}
      />

      {/*
        다 열린 뒤에만 링크를 건다. 그 전에는 눌러도 안 넘어간다 —
        스크롤로 벽이 열리는 장면을 건너뛰지 않게 하려는 것.
      */}
      {ready ? (
        <Link
          href="/home"
          aria-label="Enter"
          className="fixed inset-0 z-10"
          style={{ WebkitTapHighlightColor: "transparent" }}
        />
      ) : null}
    </div>
  );
}
