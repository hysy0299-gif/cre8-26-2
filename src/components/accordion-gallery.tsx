"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import "./accordion-gallery.css";

/**
 * React Bits의 AccordionGallery — 칸에 커서를 올리면 그 칸이 열리고 나머지가 접힌다.
 *
 * 원본과 다른 점
 * - image가 선택값이다. 사진이 없으면 빈 판으로 두고 라벨만 세운다.
 * - 그래서 라벨을 접힌 칸에서도 계속 띄운다. 원본은 펼쳐진 칸에만 띄우는데,
 *   그건 사진이 칸을 설명해줄 때 성립하는 규칙이다.
 * - 라벨 옆 강조 막대 제거 — 어느 칸이 열렸는지는 폭과 색이 이미 말해준다.
 * - 사진을 cover가 아니라 contain으로 담는다. 칸 폭이 계속 바뀌는 구조라
 *   cover로 채우면 열고 접을 때마다 사진이 다르게 잘린다.
 * - 색 프롭 세 개 → CSS 변수 한 벌(역할 토큰).
 * - <a href> → next/link.
 * - height가 CSS 길이도 받는다. 전체 화면(100dvh)에 깔아야 해서.
 */
export interface AccordionItem {
  label: string;
  href: string;
  /** 없으면 빈 판 */
  image?: string;
  alt?: string;
}

interface AccordionGalleryProps {
  items: AccordionItem[];
  defaultIndex?: number;
  /** px 숫자 또는 CSS 길이 문자열 */
  height?: number | string;
  gap?: number;
  radius?: number;
  /** 펼쳐진 칸이 차지하는 비율 (0.2 – 0.9) */
  expandRatio?: number;
  orientation?: "horizontal" | "vertical";
  duration?: number;
  ease?: string;
  /** 접힌 칸이 뒤로 눕는 각도(도). 0이면 평평하게 */
  tilt?: number;
  trigger?: "hover" | "click";
  grayscale?: boolean;
  className?: string;
}

export function AccordionGallery({
  items,
  defaultIndex = 0,
  height = 460,
  gap = 10,
  radius = 0,
  expandRatio = 0.52,
  orientation = "horizontal",
  duration = 0.6,
  ease = "power3.out",
  tilt = 8,
  trigger = "hover",
  grayscale = true,
  className = "",
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);

  const vertical = orientation === "vertical";
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;

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
    [active, count, expandRatio, duration, ease, vertical, tilt, grayscale],
  );

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => applyLayout(!firstRunRef.current);

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
                  {/* next/image가 아니라 <img>인 이유 — transform/filter를 직접 먹여야 한다 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.alt || item.label} draggable={false} />
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
