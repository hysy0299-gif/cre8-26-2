"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
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

export default function LandingPage() {
  const morphRef = useRef<MorphingTextHandle>(null);

  const handleProgress = useCallback((p: number) => {
    const t = (p - MORPH_FROM) / (MORPH_TO - MORPH_FROM);
    morphRef.current?.setProgress(Math.min(Math.max(t, 0), 1));
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

      {/* 화면 아무 데나 눌러도 들어가진다. 스크롤은 그대로 통과한다. */}
      <Link
        href="/home"
        aria-label="Enter"
        className="fixed inset-0 z-10"
        style={{ WebkitTapHighlightColor: "transparent" }}
      />
    </div>
  );
}
