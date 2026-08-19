"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from "react";

/**
 * Magic UI의 MorphingText — 흐림+임계값 필터로 글자가 녹아 바뀌는 효과.
 *
 * 원본은 배열을 시간에 맞춰 무한 순환한다. 여기선 시간을 쓰지 않고
 * **바깥에서 진행도(0→1)를 먹인다** — 랜딩에서 스크롤이 그 진행도를 몬다.
 * 진행도를 state로 올리면 60fps로 리렌더가 도니 ref로 DOM만 직접 만진다.
 */
export interface MorphingTextHandle {
  /** 0이면 from만, 1이면 to만 보인다 */
  setProgress(p: number): void;
}

interface MorphingTextProps {
  from: string;
  to: string;
  className?: string;
  ref?: Ref<MorphingTextHandle>;
}

/** 흐림 최대치 — 넘어가면 글자가 사라진 것과 같다 */
const MAX_BLUR = 100;

const blurFor = (v: number) => (v > 0 ? Math.min(8 / v - 8, MAX_BLUR) : MAX_BLUR);

export function MorphingText({ from, to, className = "", ref }: MorphingTextProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLSpanElement>(null);
  const toRef = useRef<HTMLSpanElement>(null);

  const setProgress = useCallback((p: number) => {
    const root = rootRef.current;
    const a = fromRef.current;
    const b = toRef.current;
    if (!root || !a || !b) return;

    const f = Math.min(Math.max(p, 0), 1);
    const inv = 1 - f;

    // 양끝에서는 필터를 떼야 글자가 또렷하게 선다.
    // 물고 있으면 최종 상태의 GRIT이 미세하게 뭉갠 채로 남는다.
    const settled = f <= 0 || f >= 1;
    root.style.filter = settled ? "none" : "url(#morph-threshold) blur(0.6px)";

    a.style.filter = settled ? "none" : `blur(${blurFor(inv)}px)`;
    a.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    b.style.filter = settled ? "none" : `blur(${blurFor(f)}px)`;
    b.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
  }, []);

  useImperativeHandle(ref, () => ({ setProgress }), [setProgress]);

  useEffect(() => {
    setProgress(0);
  }, [setProgress, from, to]);

  return (
    <div ref={rootRef} className={`relative w-full text-center leading-none ${className}`}>
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
