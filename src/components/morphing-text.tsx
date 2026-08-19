"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Magic UI의 MorphingText — 흐림+임계값 필터로 글자가 녹아 바뀌는 효과.
 *
 * 원본은 배열을 무한 순환하지만 여기선 **한 번만** 바꾼다.
 * 랜딩은 "Be Experimental"을 3초 보여준 뒤 "GRIT"으로 굳고 거기서 멈춘다 —
 * 계속 돌면 첫 화면이 안 가라앉고 클릭을 방해한다.
 */
interface MorphingTextProps {
  from: string;
  to: string;
  /** from을 그대로 두는 시간(초) */
  holdSeconds?: number;
  /** 녹아 바뀌는 데 걸리는 시간(초) */
  morphSeconds?: number;
  className?: string;
}

/** 흐림 최대치 — 넘어가면 글자가 사라진 것과 같다 */
const MAX_BLUR = 100;

export function MorphingText({
  from,
  to,
  holdSeconds = 3,
  morphSeconds = 1.5,
  className = "",
}: MorphingTextProps) {
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const a = fromRef.current;
    const b = toRef.current;
    if (!a || !b) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /** 0이면 from만, 1이면 to만 보인다 */
    const paint = (f: number) => {
      const inv = 1 - f;
      b.style.filter = f > 0 ? `blur(${Math.min(8 / f - 8, MAX_BLUR)}px)` : `blur(${MAX_BLUR}px)`;
      b.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
      a.style.filter =
        inv > 0 ? `blur(${Math.min(8 / inv - 8, MAX_BLUR)}px)` : `blur(${MAX_BLUR}px)`;
      a.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    const settle = () => {
      a.style.filter = "none";
      a.style.opacity = "0%";
      b.style.filter = "none";
      b.style.opacity = "100%";
      setDone(true);
    };

    paint(0);

    if (reduced) {
      const t = setTimeout(settle, holdSeconds * 1000);
      return () => clearTimeout(t);
    }

    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;

      if (elapsed < holdSeconds) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const f = Math.min((elapsed - holdSeconds) / morphSeconds, 1);
      paint(f);

      if (f < 1) raf = requestAnimationFrame(tick);
      else settle();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, holdSeconds, morphSeconds]);

  return (
    <div
      className={`relative w-full text-center leading-none ${className}`}
      // 다 굳은 뒤에도 필터를 물고 있으면 글자가 미세하게 뭉개진다
      style={done ? undefined : { filter: "url(#morph-threshold) blur(0.6px)" }}
    >
      {/* 두 글자가 같은 자리에 겹쳐 있어야 녹아 넘어가는 것처럼 보인다 */}
      <span className="absolute inset-x-0 top-0 inline-block w-full" ref={fromRef}>
        {from}
      </span>
      <span className="absolute inset-x-0 top-0 inline-block w-full" ref={toRef}>
        {to}
      </span>
      {/* 자리 확보용 — 실제로 보이는 건 위 두 span이다 */}
      <span className="invisible inline-block" aria-hidden="true">
        {from.length > to.length ? from : to}
      </span>

      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="morph-threshold">
            {/* 알파를 극단으로 밀어 흐릿한 가장자리를 한 덩어리로 붙인다 */}
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
