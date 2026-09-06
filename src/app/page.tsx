"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { MorphingText, type MorphingTextHandle } from "@/components/morphing-text";
import { ScrollExpand } from "@/components/scroll-expand";

/**
 * LANDING — 스크롤이 모는 진입 화면.
 *
 * 내리면 벽 사진 프레임이 열려 화면을 먹고, 같은 스크롤로
 * "Be Experimental"이 "GRIT"으로 녹아 바뀐다. 누르면 메인화면으로.
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
