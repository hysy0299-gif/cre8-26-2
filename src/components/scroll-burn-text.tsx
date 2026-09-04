"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { SYMBOL_PATH, SYMBOL_VIEW_BOX } from "@/components/logo";

/**
 * 스크롤을 내리면 문단이 앞으로 다가와 읽히고, 타들어가듯 사라지며
 * 뒤에 서 있던 다음 문단이 드러난다.
 *
 * 원본(ScrollBurnText)에서 가져온 건 움직임의 논리뿐이다.
 * - shadcn을 쓰지 않으므로 cn·bg-background 같은 것은 전부 우리 역할 토큰으로 바꿨다.
 * - **글자가 사라지는 모양을 GRIT 심볼로 바꿨다** — 아래 logoField 참고.
 * - 다가오는 폭을 줄였다. 원본은 4배까지 확대되는데 그러면 정작 심볼 모양으로
 *   뚫리는 순간에 글자가 화면 밖으로 나가 모양이 안 보인다.
 * - 문단을 주장 한 줄 + 본문으로 나눠 받는다. 원본은 통글이라 긴 원고가 안 읽힌다.
 */
export interface ManifestoSection {
  /** 문단의 주장. 한 줄로 굵게 선다 */
  lead: string;
  /** 그 근거. 주장 아래에 작고 가볍게 붙는다 */
  body: string;
}

export interface ScrollBurnTextProps {
  /** 읽히는 순서대로의 문단들 */
  sections: ManifestoSection[];
  /** 첫 문단이 읽힐 만큼 다가오기 전 화면에 뜨는 안내. 스크롤 시작하면 사라진다 */
  hint?: ReactNode;
  /** 문단 하나에 배정되는 스크롤 거리. 길수록 느리다 */
  runway?: string;
  className?: string;
}

/** 문단이 자기 구간에서 타기 시작하는 지점 */
const BURN_AT = 0.62;
/** 다 타는 데 쓰는 구간 길이 */
const BURN_SPAN = 0.38;
/** 첫 문단이 앞에 닿기 전까지의 접근 구간 */
const LEAD_IN = 0.7;
/** 앞 문단 뒤에 서 있는 문단의 투명도 */
const DIM = 0.3;
/** 첫 화면에서 첫 문단이 이미 들어와 있는 정도 — 0이면 빈 화면으로 시작한다 */
const OPEN = 0.22;
/** 문단이 태어나는 거리(읽히는 거리를 1로 봤을 때) */
const FAR = 1.8;
/**
 * 사라질 때의 거리. 원본은 0.25라 마지막에 4배까지 확대되는데,
 * 그러면 심볼 모양으로 뚫리는 순간 글자가 화면 밖으로 나가 모양이 안 보인다.
 */
const NEAR = 0.75;
/** 글자 하나가 사그라드는 구간. 아래 opacity 클래스의 0.09와 짝이다 */
const RAMP = 0.09;

/** 심볼을 구워 넣을 판의 한 변(px). 글자 수백 개를 찍어보는 용도라 이 정도면 충분하다 */
const FIELD = 128;
/** 심볼이 문단의 짧은 변에서 차지하는 비율. 1에 가까울수록 크게 보인다 */
const LOGO_FIT = 0.94;
/** 번짐 반경 — 심볼 경계에서 바깥으로 얼마나 부드럽게 이어질지 */
const BLUR = 6;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 분리형 박스 블러 한 번 */
function blurPass(src: Float32Array, n: number, r: number) {
  const tmp = new Float32Array(n * n);
  const out = new Float32Array(n * n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let sum = 0;
      let hits = 0;
      for (let k = -r; k <= r; k++) {
        const xx = x + k;
        if (xx < 0 || xx >= n) continue;
        sum += src[y * n + xx];
        hits++;
      }
      tmp[y * n + x] = sum / hits;
    }
  }
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      let sum = 0;
      let hits = 0;
      for (let k = -r; k <= r; k++) {
        const yy = y + k;
        if (yy < 0 || yy >= n) continue;
        sum += tmp[yy * n + x];
        hits++;
      }
      out[y * n + x] = sum / hits;
    }
  }
  return out;
}

const fieldCache = new Map<number, Float32Array>();

/**
 * GRIT 심볼을 "언제 타는지"의 지도로 굽는다.
 *
 * 심볼 path를 캔버스에 채우고 알파만 꺼내 몇 번 번지게 한다.
 * 심볼 안쪽이 1, 멀어질수록 0으로 부드럽게 떨어지는 판이 나온다.
 * 글자마다 자기 자리의 값을 뒤집어 문턱값으로 삼으면,
 * 심볼 안쪽 글자가 먼저 사라지고 그 구멍이 심볼 모양 그대로 번져 나간다.
 *
 * SVG 마스크가 아니라 판을 굽는 이유 — 마스크는 글자를 잘라내지만,
 * 여기서는 글자 하나하나가 제 차례에 사그라들어야 한다.
 *
 * `pad`는 판 안에서 심볼이 차지하는 비율이다. 문단의 가로세로비에 맞춰
 * 심볼을 줄여 넣어야 위아래가 안 잘리므로, 판을 비율별로 캐시한다.
 */
function logoField(pad: number) {
  const key = Math.round(pad * 100);
  const hit = fieldCache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = FIELD;
  canvas.height = FIELD;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const [, , vbW, vbH] = SYMBOL_VIEW_BOX.split(" ").map(Number);
  const box = FIELD * pad;
  const scale = box / Math.max(vbW, vbH);
  const inset = (FIELD - box) / 2;

  ctx.setTransform(scale, 0, 0, scale, inset, inset);
  ctx.fillStyle = "#000";
  ctx.fill(new Path2D(SYMBOL_PATH));

  const { data } = ctx.getImageData(0, 0, FIELD, FIELD);
  let f = new Float32Array(FIELD * FIELD);
  for (let i = 0; i < f.length; i++) f[i] = data[i * 4 + 3] / 255;

  for (let pass = 0; pass < 3; pass++) f = blurPass(f, FIELD, BLUR);

  let max = 0;
  for (const v of f) if (v > max) max = v;
  if (max > 0) for (let i = 0; i < f.length; i++) f[i] /= max;

  fieldCache.set(key, f);
  return f;
}

/** 애니메이션을 원하지 않는 사용자에게는 문단을 그대로 쌓아 보여준다 */
function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduce(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);
  return reduce;
}

/** 글자 하나하나를 따로 그린다 — 각자 제 차례에 사그라들어야 하므로 */
function glyphs(text: string) {
  return Array.from(text).map((ch, k) =>
    ch === " " ? (
      " "
    ) : (
      // 비교는 전부 CSS가 한다 — 문단에 값 하나만 써주면 글자마다 박아둔
      // 문턱값과 대조해 엔진이 수백 개를 처리한다
      <span key={k} data-g className="opacity-[calc((var(--t,1)_+_0.09_-_var(--b,0))*11)]">
        {ch}
      </span>
    ),
  );
}

/** 주장 한 줄 — 굵게, 크게 */
const LEAD_CLASS = "block text-[clamp(1.15rem,2.6vw,1.75rem)] leading-[1.2] font-bold";
/** 본문 — 작고 가볍게, 줄간격 넉넉히. 긴 글이라 굵기로 밀어붙이면 안 읽힌다 */
const BODY_CLASS = "mt-4 block text-[clamp(0.9rem,1.3vw,1.05rem)] leading-[1.7] font-light";

export function ScrollBurnText({
  sections,
  hint = "scroll",
  runway = "170vh",
  className = "",
}: ScrollBurnTextProps) {
  const reduced = useReducedMotion();

  const runwayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const count = sections.length;

  useEffect(() => {
    if (reduced) return;
    const el = runwayRef.current;
    if (!el) return;

    /**
     * 글자가 언제 타는지는 줄바꿈이 끝난 뒤에야 정해진다.
     * 글자 순서로 정하면 읽는 순서대로 지워지는 와이프가 되므로,
     * 실제로 놓인 자리를 재서 심볼 판에서 값을 꺼내 쓴다.
     */
    const measure = () => {
      blockRefs.current.forEach((block) => {
        if (!block) return;
        const w = block.offsetWidth || 1;
        const h = block.offsetHeight || 1;
        // 문단 전체가 판 안에 들어오도록 긴 변을 기준으로 잡고,
        // 심볼은 짧은 변에 맞춰 넣는다 — 그래야 위아래가 안 잘린다
        const size = Math.max(w, h);
        const field = logoField((LOGO_FIT * Math.min(w, h)) / size);
        if (!field) return;
        const cx = w / 2;
        const cy = h / 2;

        // 주장·본문이 감싸는 span 안에 들어 있어 자식 순회로는 못 잡는다.
        // offsetLeft/Top은 relative인 문단 기준으로 나오므로 중첩돼도 값은 맞다
        block.querySelectorAll<HTMLElement>("[data-g]").forEach((node) => {
          const px = node.offsetLeft + node.offsetWidth / 2;
          const py = node.offsetTop + node.offsetHeight / 2;
          const u = (px - cx) / size + 0.5;
          const v = (py - cy) / size + 0.5;

          let logo = 0;
          if (u >= 0 && u < 1 && v >= 0 && v < 1) {
            logo = field[Math.floor(v * FIELD) * FIELD + Math.floor(u * FIELD)];
          }

          // 벡터 경계 그대로면 너무 기계적이라 아주 옅게만 흔들어 준다
          const grain =
            0.5 + 0.5 * Math.sin(u * 23.1 + v * 17.7 + 1.3) * Math.sin(u * 9.4 - v * 12.6);

          node.style.setProperty("--t", `${clamp01(0.04 + 0.88 * (1 - logo) + 0.08 * grain)}`);
        });
      });
    };

    // 지금 타고 있는 문단만 다시 쓴다. 나머지는 0이나 1에 머무른다
    const burnt: number[] = [];
    let active = -1;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const p = clamp01(-rect.top / (rect.height - viewport || 1));

      // 마지막 문단은 타기 직전에 멈춘다 — 재만 남은 화면으로 끝나지 않게
      const t = -LEAD_IN + p * (count - 1 + LEAD_IN + BURN_AT);
      let front = 0;

      blockRefs.current.forEach((block, i) => {
        const wrap = block?.parentElement;
        if (!block || !wrap) return;
        const q = t - i;
        if (q > 1) front = Math.min(i + 1, count - 1);

        const alpha =
          clamp01((q + LEAD_IN + OPEN) / 0.45) * (DIM + (1 - DIM) * clamp01(q / 0.45));

        if (alpha <= 0 || q > 1) {
          wrap.style.visibility = "hidden";
          return;
        }
        wrap.style.visibility = "visible";
        wrap.style.opacity = `${alpha}`;
        // 렌즈다. 거리가 일정하게 줄고 크기는 그 역수라, 멀 때는 천천히
        // 가까울수록 훅 다가온다 — 실제로 다가오는 물체가 그리는 곡선이다
        const depth = Math.max(FAR - ((FAR - NEAR) * (q + LEAD_IN)) / (1 + LEAD_IN), NEAR);
        wrap.style.transform = `scale(${1 / depth})`;

        const burn = clamp01((q - BURN_AT) / BURN_SPAN) * (1 + RAMP);
        if (burnt[i] !== burn) {
          burnt[i] = burn;
          block.style.setProperty("--b", `${burn}`);
          block.style.setProperty("--ab", `${0.3 + burn * 1.8}`);
        }
      });

      if (hintRef.current) hintRef.current.style.opacity = `${clamp01(1 - p / 0.08)}`;
      if (active !== front) {
        active = front;
        if (counterRef.current) {
          counterRef.current.textContent = `${String(front + 1).padStart(2, "0")} / ${String(count).padStart(2, "0")}`;
        }
      }
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [reduced, count]);

  /**
   * relative — 글자 위치를 화면이 아니라 문단 기준으로 재기 위해서.
   * 폭은 화면에서 뽑는다. 브레이크포인트로 끊으면 칸이 부드럽게 커지는 사이
   * 글씨만 계단처럼 남는다.
   */
  const column = "text-ink relative w-[min(84vw,34rem)] text-center tracking-tight";

  if (reduced) {
    return (
      <div className={`w-full ${className}`}>
        <div className="mx-auto grid max-w-2xl gap-16">
          {sections.map((s, i) => (
            <p key={i} className="text-ink w-full">
              <span className={LEAD_CLASS}>{s.lead}</span>
              <span className={BODY_CLASS}>{s.body}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div ref={runwayRef} style={{ height: `calc(${runway} * ${count})` }} className="w-full">
        <div className="bg-ground sticky top-0 h-dvh w-full overflow-hidden">
          <div
            ref={counterRef}
            className="text-label text-ink-muted pointer-events-none absolute bottom-5 left-0 z-10 tabular-nums uppercase"
          />

          {hint ? (
            <div
              ref={hintRef}
              className="pointer-events-none absolute inset-x-0 bottom-16 z-10 text-center"
            >
              <span className="text-label text-ink-muted after:bg-ink-muted/40 relative uppercase after:absolute after:top-full after:left-1/2 after:mt-2 after:h-8 after:w-px after:content-['']">
                {hint}
              </span>
            </div>
          ) : null}

          {sections.map((s, i) => (
            <div
              key={i}
              // 첫 프레임이 자리를 잡기 전에는 감춰둔다 — 문단이 겹쳐 번쩍이지 않게
              style={{ visibility: "hidden" }}
              className="absolute inset-0 grid place-items-center will-change-transform"
              aria-hidden
            >
              <p
                ref={(node) => {
                  blockRefs.current[i] = node;
                }}
                className={column}
                style={
                  {
                    "--b": 0,
                    "--ab": 0.3,
                    // 색수차는 글자를 두 벌 더 그리는 대신 그림자 두 개로 낸다.
                    // 원본의 형광 분홍·시안 대신 팔레트의 초록·중간회색을 쓴다
                    textShadow:
                      "calc(var(--ab) * -1px) 0 var(--color-grit-green), calc(var(--ab) * 1px) 0 var(--color-grit-mid)",
                  } as CSSProperties
                }
              >
                <span className={LEAD_CLASS}>{glyphs(s.lead)}</span>
                <span className={BODY_CLASS}>{glyphs(s.body)}</span>
              </p>
            </div>
          ))}

          {/* 글자 단위로 쪼개져 있어 스크린리더가 낱글자로 읽는다. 원문을 한 번 더 둔다 */}
          <div className="sr-only">
            {sections.map((s, i) => (
              <p key={i}>{`${s.lead} ${s.body}`}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
