"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { gsap } from "gsap";
import "./accordion-gallery.css";

/**
 * React Bits의 AccordionGallery — **모션과 인터랙션만** 가져왔다.
 * 커서를 올린 칸이 열리고 나머지가 접히며, 접힌 칸은 살짝 뒤로 눕는다.
 *
 * 비례와 색은 원본을 따르지 않는다
 * - 열린 칸의 폭을 **그 칸 사진의 원본 비율**에서 뽑는다(fitOpen).
 *   원본은 expandRatio 하나로 모든 칸을 똑같이 벌리는데, 그러면 사진이
 *   칸에 맞춰 잘리거나 여백이 생긴다. 여기선 반대로 칸이 사진에 맞춘다 —
 *   펼쳐진 사진은 언제나 원본 비율 그대로, 무손실로 화면을 채운다.
 * - 접힌 칸은 그 남은 폭을 나눠 갖고 사진은 좌우가 잘린다(cover). 접힌 칸은
 *   "여기 뭔가 있다"는 신호지 사진을 보여주는 자리가 아니다.
 * - 색 프롭 세 개 → CSS 변수 한 벌(역할 토큰).
 * - <a href> → next/link.
 * - 라벨을 접힌 칸에서도 계속 띄운다. 원본은 열린 칸에만 띄운다.
 * - height가 CSS 길이도 받는다.
 */
export interface AccordionImage {
  src: string;
  /** 두 벌 이상 구웠으면 srcset. 브라우저가 화면 배율에 맞는 걸 고른다 */
  srcSet?: string;
  /** 원본 비율. 열린 칸의 폭이 여기서 나온다 */
  width: number;
  height: number;
}

export interface AccordionItem {
  label: string;
  href: string;
  /** 없으면 빈 판 */
  image?: AccordionImage;
  alt?: string;
}

interface AccordionGalleryProps {
  items: AccordionItem[];
  defaultIndex?: number;
  /** px 숫자 또는 CSS 길이 문자열 */
  height?: number | string;
  gap?: number;
  radius?: number;
  /** 사진 비율을 못 쓸 때(사진 없는 칸) 쓰는 기본 벌어짐 비율 (0.2 – 0.9) */
  expandRatio?: number;
  /** 열린 칸의 폭을 그 칸 사진의 원본 비율에서 뽑는다 */
  fitOpen?: boolean;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  /** 접힌 칸이 뒤로 눕는 각도(도). 0이면 평평하게 */
  tilt?: number;
  trigger?: "hover" | "click";
  grayscale?: boolean;
  /**
   * 열린 칸의 채도 배율. 사진 자체가 거의 흑백이라 grayscale만 풀면
   * 전환이 눈에 안 띈다. 1이면 원본 그대로.
   */
  saturate?: number;
  /** 열린 칸의 화면상 폭. srcset 고르는 데 쓴다 */
  sizes?: string;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function AccordionGallery({
  items,
  defaultIndex = 0,
  height = 460,
  gap = 10,
  radius = 0,
  expandRatio = 0.5,
  fitOpen = true,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  tilt = 8,
  trigger = "hover",
  grayscale = true,
  saturate = 2,
  sizes = "45vw",
  className = "",
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  /** 실측한 바깥 상자. 열린 칸 폭을 사진 비율에서 뽑으려면 실제 높이가 필요하다 */
  const boxRef = useRef({ w: 0, h: 0 });

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(clamp(defaultIndex, 0, count - 1));

  /**
   * 열린 칸이 안쪽 폭에서 차지할 비율.
   *
   * 칸 높이는 상자 높이와 같으니, 사진을 원본 비율로 채우려면
   * 열린 칸의 폭이 정확히 `높이 × 사진비율`이어야 한다. 그 폭을
   * 칸 사이 간격을 뺀 안쪽 폭으로 나눈 값이 여기서 구하는 비율이다.
   */
  const openFraction = useCallback(
    (i: number) => {
      const img = items[i]?.image;
      const { w, h } = boxRef.current;
      const inner = w - gap * (count - 1);

      if (!fitOpen || vertical || !img || inner <= 0 || h <= 0) return expandRatio;
      return clamp((img.width / img.height) * (h / inner), 0.2, 0.9);
    },
    [items, fitOpen, vertical, expandRatio, gap, count],
  );

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const f = openFraction(active);
      const grow = count > 1 ? (f * (count - 1)) / (1 - f) : 1;

      tlRef.current?.kill();
      const dur = animate && !reduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          tl.to(
            media,
            {
              "--ag-gray": grayscale ? (isActive ? 0 : 1) : 0,
              "--ag-sat": isActive ? saturate : 1,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }
      });

      tlRef.current = tl;
    },
    [active, count, openFraction, duration, ease, vertical, tilt, grayscale, saturate],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      boxRef.current = { w: rect.width, h: rect.height };
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => () => void tlRef.current?.kill(), []);

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? " accordion-gallery--vertical" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={
        {
          "--ag-gap": `${gap}px`,
          "--ag-radius": `${radius}px`,
          height: typeof height === "number" ? `${height}px` : height,
        } as CSSProperties
      }
      role="list"
      aria-label="Sections"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <Link
            key={item.href}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            href={item.href}
            className={`ag-panel${isActive ? " ag-panel--active" : ""}`}
            // 접힌 칸을 한 번 누르면 펼치기만 하고, 펼쳐진 칸을 누르면 이동한다
            onClick={(e) => {
              if (i !== active) {
                e.preventDefault();
                setActive(i);
              }
            }}
            onMouseEnter={() => trigger === "hover" && setActive(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            role="listitem"
            aria-current={isActive ? "true" : undefined}
          >
            {item.image ? (
              <span className="ag-panel__frame">
                <span
                  className="ag-panel__media"
                  ref={(el) => {
                    mediaRefs.current[i] = el;
                  }}
                >
                  {/* next/image가 아니라 <img>인 이유 — 흑백 필터를 직접 먹여야 한다 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.src}
                    srcSet={item.image.srcSet}
                    sizes={sizes}
                    width={item.image.width}
                    height={item.image.height}
                    alt={item.alt || item.label}
                    draggable={false}
                  />
                </span>
                <span className="ag-panel__overlay" aria-hidden="true" />
              </span>
            ) : null}

            <span className="ag-panel__label">
              <span className="ag-panel__text">{item.label}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
