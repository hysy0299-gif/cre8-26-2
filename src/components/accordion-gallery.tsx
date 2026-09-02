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
 * React Bits의 AccordionGallery.
 *
 * 원본 로직을 그대로 쓴다 — expandRatio로 칸을 벌리고, 사진은 cover로 채우고,
 * 접힌 칸은 흑백으로 눕고, 라벨은 열린 칸에서 밀려 들어온다.
 *
 * 이 프로젝트에 맞춘 부분만 다르다
 * - <a href> → next/link (내부 이동이라 프리페치가 붙는다)
 * - <img>에 srcSet/sizes. 사진이 화면 절반을 차지해서 한 벌만 두면 화질이 깨진다
 * - perspective-origin이 열린 칸을 따라간다. 원본은 상자 정중앙에 박혀 있어서
 *   양 끝 칸이 열리면 부채가 한쪽으로 쏠린다
 * - will-change 제거. 칸이 상시 합성 레이어로 올라가면 브라우저가 한 번 뜬
 *   래스터를 늘려 써서 사진이 뭉갠다
 * - height가 CSS 길이 문자열도 받는다. 화면 높이에 맞춰야 해서
 */
export interface AccordionImage {
  src: string;
  /** 두 벌 이상 구웠으면 srcset. 브라우저가 화면 배율에 맞는 걸 고른다 */
  srcSet?: string;
  width: number;
  height: number;
}

export interface AccordionItem {
  label: string;
  href: string;
  image?: AccordionImage;
  alt?: string;
}

interface AccordionGalleryProps {
  items: AccordionItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  /** px 숫자 또는 CSS 길이 문자열 */
  height?: number | string;
  gap?: number;
  radius?: number;
  /** 펼쳐진 칸이 차지하는 비율 (0.2 – 0.9) */
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  /** 칸이 벌어질 때 사진이 안에서 미끄러지는 정도. 0이면 끔 */
  parallax?: number;
  /** 접힌 칸이 뒤로 눕는 각도(도) */
  tilt?: number;
  /** 라벨 막대와 글자가 들어오는 시간차(초) */
  stagger?: number;
  trigger?: "hover" | "click";
  showLabels?: boolean;
  grayscale?: boolean;
  /** 열린 칸의 화면상 폭. srcset 고르는 데 쓴다 */
  sizes?: string;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

export function AccordionGallery({
  items,
  defaultIndex = 1,
  accentColor = "#000000",
  overlayColor = "#282828",
  textColor = "#ffffff",
  height = 460,
  gap = 8,
  radius = 10,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.75,
  ease = "power3.out",
  parallax = 0.85,
  tilt = 8,
  stagger = 0.06,
  trigger = "hover",
  showLabels = true,
  grayscale = true,
  sizes = "(max-width: 520px) 100vw, 55vw",
  className = "",
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(clamp(defaultIndex, 0, count - 1));

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      const root = rootRef.current;
      if (!panels.length || !root) return;

      // 렌더 중에 window를 읽지 않는다 — 서버에는 없다
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const r = clamp(expandRatio, 0.2, 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !reduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        tl.to(panel, { flexGrow: isActive ? grow : 1, ...rotProp, duration: dur, ease }, 0);

        if (media) {
          const drift = clamp(active - i, -1.5, 1.5);
          const shift = drift * parallax * mediaSize * 0.06;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: vertical ? 0 : isActive ? 0 : shift,
              y: vertical ? (isActive ? 0 : shift) : 0,
              "--ag-gray": grayscale ? (isActive ? 0 : 1) : 0,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }

        if (showLabels && bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              { opacity: 1, x: 0, duration: dur, ease, stagger: reduced ? 0 : stagger },
              0,
            );
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      // 소실점을 열린 칸 한가운데로. 그래야 열린 칸이 정면으로 서고 나머지가 좌우로 눕는다
      const units = grow + (count - 1);
      const originX = ((active + grow / 2) / units) * 100;
      tl.to(root, { "--ag-origin-x": `${originX}%`, duration: dur, ease }, 0);

      tlRef.current = tl;
    },
    [
      active,
      count,
      expandRatio,
      duration,
      ease,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
    ],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const total = vertical ? rect.height : rect.width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(140, usable * clamp(expandRatio, 0.2, 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio, vertical]);

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
          "--ag-accent": accentColor,
          "--ag-overlay": overlayColor,
          "--ag-text": textColor,
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
            style={{ borderRadius: `${radius}px` }}
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
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span
                className="ag-panel__media"
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
              >
                {item.image ? (
                  // next/image가 아니라 <img>인 이유 — transform/filter를 직접 먹여야 한다
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image.src}
                    srcSet={item.image.srcSet}
                    sizes={sizes}
                    width={item.image.width}
                    height={item.image.height}
                    alt={item.alt || item.label}
                    draggable={false}
                  />
                ) : null}
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>

            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span
                  className="ag-panel__bar"
                  ref={(el) => {
                    barRefs.current[i] = el;
                  }}
                />
                <span
                  className="ag-panel__text"
                  ref={(el) => {
                    textRefs.current[i] = el;
                  }}
                >
                  {item.label}
                </span>
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
