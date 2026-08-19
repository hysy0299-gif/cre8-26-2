"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import "./flowing-menu.css";

/**
 * React Bits의 FlowingMenu — interaction logic만 가져와 TS로 옮기고
 * 색·굵기를 프로젝트 토큰에 맞췄다.
 *
 * 원본과 다른 점
 * - <a href> → next/link (클라이언트 전환)
 * - 색 프롭 6개 → CSS 변수 한 벌. 바탕을 뒤집으면 메뉴도 같이 따라간다
 * - image는 선택값. 사진 전엔 틴트 블록이 자리를 지킨다
 * - prefers-reduced-motion이면 마퀴를 아예 띄우지 않는다
 */
export interface FlowingMenuItem {
  link: string;
  text: string;
  /** 마퀴에 흐르는 이미지. 없으면 틴트 블록 */
  image?: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
  /** 마퀴 한 바퀴에 걸리는 시간(초). 낮을수록 빠르다 */
  speed?: number;
  className?: string;
}

export function FlowingMenu({ items, speed = 15, className = "" }: FlowingMenuProps) {
  return (
    <div className={`menu-wrap ${className}`}>
      <nav className="menu">
        {items.map((item) => (
          <MenuItem key={item.link} {...item} speed={speed} />
        ))}
      </nav>
    </div>
  );
}

const ANIMATION_DEFAULTS = { duration: 0.6, ease: "expo" };

const distMetric = (x: number, y: number, x2: number, y2: number) => {
  const dx = x - x2;
  const dy = y - y2;
  return dx * dx + dy * dy;
};

/** 커서가 위/아래 중 어느 모서리로 들어왔는지 — 마퀴가 그 방향에서 밀려 나온다 */
const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) =>
  distMetric(mouseX, mouseY, width / 2, 0) < distMetric(mouseX, mouseY, width / 2, height)
    ? "top"
    : "bottom";

function MenuItem({ link, text, image, speed }: FlowingMenuItem & { speed: number }) {
  const itemRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const marqueeInnerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  // 화면 폭을 채울 만큼만 복제한다 — 좁은 화면에서 불필요하게 많이 그리지 않도록
  useEffect(() => {
    const calculateRepetitions = () => {
      const content = marqueeInnerRef.current?.querySelector<HTMLElement>(".marquee__part");
      if (!content) return;
      const contentWidth = content.offsetWidth;
      if (contentWidth === 0) return;
      setRepetitions(Math.max(4, Math.ceil(window.innerWidth / contentWidth) + 2));
    };

    calculateRepetitions();
    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [text, image]);

  // 정확히 한 덩어리 폭만큼 밀어 이음매 없이 순환시킨다
  useEffect(() => {
    const setupMarquee = () => {
      const inner = marqueeInnerRef.current;
      const content = inner?.querySelector<HTMLElement>(".marquee__part");
      if (!inner || !content) return;
      const contentWidth = content.offsetWidth;
      if (contentWidth === 0) return;

      animationRef.current?.kill();
      animationRef.current = gsap.to(inner, {
        x: -contentWidth,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    };

    // repetitions가 반영된 DOM을 재고 시작해야 폭이 맞는다
    const timer = setTimeout(setupMarquee, 50);
    return () => {
      clearTimeout(timer);
      animationRef.current?.kill();
    };
  }, [text, image, repetitions, speed]);

  const slide = (ev: MouseEvent<HTMLElement>, entering: boolean) => {
    const item = itemRef.current;
    const marquee = marqueeRef.current;
    const inner = marqueeInnerRef.current;
    if (!item || !marquee || !inner) return;

    const rect = item.getBoundingClientRect();
    const edge = findClosestEdge(
      ev.clientX - rect.left,
      ev.clientY - rect.top,
      rect.width,
      rect.height,
    );
    const offset = edge === "top" ? "-101%" : "101%";
    const tl = gsap.timeline({ defaults: ANIMATION_DEFAULTS });

    if (entering) {
      tl.set(marquee, { y: offset }, 0)
        .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
        .to([marquee, inner], { y: "0%" }, 0);
    } else {
      tl.to(marquee, { y: offset }, 0).to(
        inner,
        { y: edge === "top" ? "101%" : "-101%" },
        0,
      );
    }
  };

  return (
    <div className="menu__item" ref={itemRef}>
      <Link
        className="menu__item-link"
        href={link}
        onMouseEnter={(e) => slide(e, true)}
        onMouseLeave={(e) => slide(e, false)}
      >
        {text}
      </Link>

      <div className="marquee" ref={marqueeRef}>
        <div className="marquee__inner-wrap">
          <div className="marquee__inner" ref={marqueeInnerRef} aria-hidden="true">
            {Array.from({ length: repetitions }, (_, idx) => (
              <div className="marquee__part" key={idx}>
                <span>{text}</span>
                <div
                  className="marquee__img"
                  style={
                    image ? ({ backgroundImage: `url(${image})` } as CSSProperties) : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
