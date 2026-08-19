"use client";

import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./scroll-expand.css";

/**
 * React Bits의 ScrollExpand — 스크롤에 따라 프레임이 열리며 미디어가 화면을 먹는다.
 *
 * 원본과 다른 점
 * - title/overlay를 자체적으로 페이드아웃하지 않는다. 대신 진행도를 밖으로 넘겨서(onProgress)
 *   그 위에 얹은 것(여기선 모핑 타이틀)을 부모가 직접 몰게 한다.
 * - 진행도를 state로 올리면 60fps로 리렌더가 돈다. 그래서 콜백으로만 흘린다.
 * - 렌더 중 ref 쓰기를 이펙트로 옮겼다(React 규칙).
 */
interface ScrollExpandProps {
  src: string;
  alt?: string;
  mediaType?: "image" | "video";
  poster?: string;
  /** 열리기 전 프레임 크기(무대 대비 %) */
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  /** 쉴 때 미디어가 확대돼 있는 배율. 열리면서 1로 돌아온다 */
  mediaZoom?: number;
  /** 여는 데 쓰는 스크롤 길이(무대 높이의 배수) */
  scrollDistance?: number;
  /** 다 열린 채로 더 붙잡아 두는 스크롤 */
  holdDistance?: number;
  /** 따라오는 시간(초). 0이면 스크롤에 딱 붙는다 */
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  /** 0→1. 매 프레임 불린다 — 여기서 setState 하면 안 된다 */
  onProgress?: (p: number) => void;
  /** 프레임 위에 계속 떠 있는 내용 */
  overlay?: ReactNode;
  /** 스크롤 시작하면 사라지는 작은 안내 */
  hint?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

export function ScrollExpand({
  src,
  alt = "",
  mediaType = "image",
  poster = "",
  startWidth = 42,
  startHeight = 58,
  startRadius = 0,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0,
  useWindowScroll = false,
  enabled = true,
  onProgress,
  overlay,
  hint,
  className = "",
  style,
}: ScrollExpandProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const cfgRef = useRef({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  });
  const onProgressRef = useRef(onProgress);

  // 렌더 중에 ref를 쓰면 React 규칙 위반이라 이펙트로 미룬다
  useEffect(() => {
    cfgRef.current = {
      startWidth,
      startHeight,
      startRadius,
      endRadius,
      mediaZoom,
      scrollDistance,
      holdDistance,
      smoothing,
      overlayScrim,
      useWindowScroll,
      enabled,
    };
    onProgressRef.current = onProgress;
  });

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = cfgRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    onProgressRef.current?.(p);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = cfgRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${
        stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))
      }px`;
    };

    const readProgress = () => {
      const c = cfgRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) return clamp(-track.getBoundingClientRect().top / span, 0, 1);
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = cfgRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (cfgRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller: Window | HTMLDivElement = useWindowScroll ? window : root;
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  return (
    <div ref={rootRef} className={`scroll-expand ${className}`.trim()} style={style}>
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {mediaType === "video" ? (
              <video
                ref={mediaRef as React.RefObject<HTMLVideoElement>}
                className="scroll-expand__media"
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // next/image는 여기서 쓰지 않는다 — transform/clip-path를 직접 먹이는 원본 <img>가 필요하다
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={mediaRef as React.RefObject<HTMLImageElement>}
                className="scroll-expand__media"
                src={src}
                alt={alt}
                draggable={false}
              />
            )}
            <div ref={scrimRef} className="scroll-expand__scrim" />
          </div>

          {overlay ? <div className="scroll-expand__overlay">{overlay}</div> : null}
          {hint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {hint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
