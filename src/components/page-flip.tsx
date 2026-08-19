"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import type { MediaItem } from "@/types/hold";
import "./page-flip.css";

/**
 * 드래그로 넘기는 책.
 *
 * 종이 한 장(leaf)이 앞뒤 두 쪽을 갖는다 — 19쪽이면 10장, 마지막 장의 뒷면은 비어 있다.
 * 그래서 펼침면은 1 / 2·3 / 4·5 … 순으로 간다. 표지는 혼자다.
 *
 * 각 장은 책등(왼쪽 모서리)을 축으로 rotateY 하고, 넘긴 장은 -180도에서 왼쪽에 쌓인다.
 * 오른쪽을 왼쪽으로 끌면 앞으로, 왼쪽을 오른쪽으로 끌면 뒤로. 그냥 클릭해도 한 장 넘어간다.
 *
 * 겹쳐 들어오는 입력 처리 —
 * 넘기는 중에 또 누르면 진행 중이던 장을 **즉시 제자리에 앉히고** 새 입력을 받는다.
 * 입력을 버리면 빠르게 누를 때 반응이 씹히고, 그냥 두면 두 장이 동시에 돌아 순서가 엉킨다.
 */
interface PageFlipProps {
  pages: MediaItem[];
  className?: string;
}

interface Leaf {
  front?: MediaItem;
  back?: MediaItem;
}

/** 끌다 놓았을 때 이만큼 넘겼으면 마저 넘긴다 */
const COMMIT_AT = 0.4;
/** 이보다 적게 움직였으면 드래그가 아니라 클릭으로 본다 */
const CLICK_SLOP = 6;
const TURN_DURATION = 0.5;

export function PageFlip({ pages, className = "" }: PageFlipProps) {
  const leaves = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      out.push({ front: pages[i], back: pages[i + 1] });
    }
    return out;
  }, [pages]);

  /**
   * 마지막 장의 뒷면이 비어 있으면(홀수 쪽) 거기까지 넘기면 빈 면이 보인다.
   * 그래서 마지막 펼침면에서 멈춘다.
   */
  const maxTurned = leaves.length - (leaves[leaves.length - 1]?.back ? 0 : 1);

  const bookRef = useRef<HTMLDivElement | null>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);

  /** 넘긴 장수. 핸들러가 즉시 읽어야 해서 ref가 진실이고 state는 표시용이다 */
  const turnedRef = useRef(0);
  const [turned, setTurned] = useState(0);

  /** 지금 돌고 있는 장 — 새 입력이 들어오면 이걸 먼저 앉힌다 */
  const flyingRef = useRef<{ leaf: number; to: number } | null>(null);
  const dragRef = useRef<{ leaf: number; startX: number; moved: number; forward: boolean } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);

  /** 넘긴 장은 나중 것이 위로, 안 넘긴 장은 앞 것이 위로 쌓인다 */
  const zIndexFor = useCallback(
    (i: number, count: number) => (i < count ? i + 1 : leaves.length - i),
    [leaves.length],
  );

  /**
   * 책 전체를 반쪽만큼 밀어주는 양(반쪽 단위).
   *
   * 닫혀 있을 때는 오른쪽 한 장뿐이라 그대로 두면 왼쪽이 빈 채로 펼쳐진 것처럼 보인다.
   * 그래서 닫힘(+1) → 펼침(0)으로 밀어서 책이 실제로 열리는 것처럼 만든다.
   */
  const offsetFor = useCallback(
    (count: number) => (count === 0 ? 1 : count >= leaves.length ? -1 : 0),
    [leaves.length],
  );

  const halfPage = () => (bookRef.current?.offsetWidth ?? 0) / 4;

  /**
   * 모든 장을 count 기준 제자리에 즉시 앉힌다.
   *
   * z-index를 JSX style로 주면 리렌더가 손으로 올려둔 값을 덮어써서
   * 드래그 중인 장이 아래로 깔린다. 그래서 z-index는 전부 여기서만 만진다.
   */
  const rest = useCallback(
    (count: number) => {
      leafRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.killTweensOf(el);
        gsap.set(el, { rotateY: i < count ? -180 : 0 });
        el.style.zIndex = String(zIndexFor(i, count));
      });
      if (bookRef.current) {
        gsap.killTweensOf(bookRef.current);
        gsap.set(bookRef.current, { x: offsetFor(count) * halfPage() });
      }
    },
    [zIndexFor, offsetFor],
  );

  useLayoutEffect(() => {
    rest(turnedRef.current);
  }, [rest]);

  // 화면 크기가 바뀌면 반쪽 폭도 바뀌므로 밀어둔 양을 다시 잡는다
  useEffect(() => {
    const onResize = () => {
      if (!bookRef.current || dragRef.current) return;
      gsap.set(bookRef.current, { x: offsetFor(turnedRef.current) * halfPage() });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [offsetFor]);

  /** 돌고 있던 장이 있으면 애니메이션을 끊고 목적지에 앉힌다 */
  const settleFlying = useCallback(() => {
    const flying = flyingRef.current;
    if (!flying) return;
    flyingRef.current = null;
    turnedRef.current = flying.to;
    setTurned(flying.to);
    rest(flying.to);
  }, [rest]);

  /** 한 장을 목적지까지 돌린다. 책 전체 밀기도 같이 간다 */
  const animate = useCallback(
    (leaf: number, to: number) => {
      const el = leafRefs.current[leaf];
      if (!el) {
        turnedRef.current = to;
        setTurned(to);
        return;
      }

      const forward = to > turnedRef.current;
      flyingRef.current = { leaf, to };
      // 도는 동안은 무조건 맨 위에 있어야 앞뒤 장에 파묻히지 않는다
      el.style.zIndex = String(leaves.length + 1);

      gsap.killTweensOf(el);
      gsap.to(el, {
        rotateY: forward ? -180 : 0,
        duration: TURN_DURATION,
        ease: "power2.inOut",
        onComplete: () => {
          if (flyingRef.current?.leaf !== leaf) return; // 사이에 다른 입력이 앉혔다
          settleFlying();
        },
      });

      if (bookRef.current) {
        gsap.killTweensOf(bookRef.current);
        gsap.to(bookRef.current, {
          x: offsetFor(to) * halfPage(),
          duration: TURN_DURATION,
          ease: "power2.inOut",
        });
      }
    },
    [leaves.length, settleFlying, offsetFor],
  );

  /** 목표 장수로 이동 — 진행 중이던 건 먼저 앉힌다 */
  const turnTo = useCallback(
    (next: number) => {
      settleFlying();
      const cur = turnedRef.current;
      const target = Math.min(Math.max(next, 0), maxTurned);
      if (target === cur) return;
      const step = target > cur ? cur + 1 : cur - 1;
      animate(target > cur ? cur : cur - 1, step);
    },
    [animate, maxTurned, settleFlying],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const book = bookRef.current;
    if (!book) return;

    // 돌고 있던 장을 먼저 앉히고 나서 어느 장을 집을지 정한다
    settleFlying();

    const rect = book.getBoundingClientRect();
    const onRightHalf = e.clientX - rect.left > rect.width / 2;
    const cur = turnedRef.current;
    const leaf = onRightHalf ? cur : cur - 1;
    if (leaf < 0 || leaf >= leaves.length) return;
    if (onRightHalf && cur >= maxTurned) return;

    dragRef.current = { leaf, startX: e.clientX, moved: 0, forward: onRightHalf };
    setIsDragging(true);
    book.setPointerCapture(e.pointerId);

    const el = leafRefs.current[leaf];
    if (el) {
      gsap.killTweensOf(el);
      el.style.zIndex = String(leaves.length + 1);
    }
    gsap.killTweensOf(book);
  };

  const progressOf = (drag: NonNullable<typeof dragRef.current>, clientX: number) => {
    const w = (bookRef.current?.offsetWidth ?? 2) / 2;
    const dx = clientX - drag.startX;
    return Math.min(Math.max((drag.forward ? -dx : dx) / w, 0), 1);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.startX));

    const f = progressOf(drag, e.clientX);
    const el = leafRefs.current[drag.leaf];
    if (el) gsap.set(el, { rotateY: drag.forward ? -180 * f : -180 * (1 - f) });

    // 표지를 넘기는 중이면 책이 열리는 만큼 같이 밀어준다
    if (bookRef.current) {
      const cur = turnedRef.current;
      const from = offsetFor(cur);
      const to = offsetFor(drag.forward ? cur + 1 : cur - 1);
      gsap.set(bookRef.current, { x: (from + (to - from) * f) * halfPage() });
    }
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setIsDragging(false);
    bookRef.current?.releasePointerCapture(e.pointerId);

    // 거의 안 움직였으면 넘기려고 누른 것으로 본다
    const commit = drag.moved < CLICK_SLOP || progressOf(drag, e.clientX) > COMMIT_AT;
    const cur = turnedRef.current;
    const next = commit ? (drag.forward ? cur + 1 : cur - 1) : cur;

    if (next === cur) {
      // 되돌아가기 — 상태는 그대로라 직접 애니메이션을 건다
      const el = leafRefs.current[drag.leaf];
      if (el) {
        flyingRef.current = { leaf: drag.leaf, to: cur };
        gsap.to(el, {
          rotateY: drag.forward ? 0 : -180,
          duration: TURN_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            if (flyingRef.current?.leaf === drag.leaf) settleFlying();
          },
        });
      }
      if (bookRef.current) {
        gsap.to(bookRef.current, {
          x: offsetFor(cur) * halfPage(),
          duration: TURN_DURATION,
          ease: "power2.inOut",
        });
      }
      return;
    }

    animate(drag.leaf, next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      turnTo(turnedRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      turnTo(turnedRef.current - 1);
    }
  };

  useEffect(() => {
    const els = leafRefs.current;
    return () => {
      els.forEach((el) => {
        if (el) gsap.killTweensOf(el);
      });
    };
  }, []);

  /** 표지는 혼자, 그 뒤로는 두 쪽씩 */
  const spreadLabel =
    turned === 0 ? "1" : `${turned * 2}–${Math.min(turned * 2 + 1, pages.length)}`;

  return (
    <div className={className}>
      <div
        ref={bookRef}
        className={`book${isDragging ? " book--dragging" : ""}`}
        role="group"
        aria-label="Brand book"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onKeyDown={handleKeyDown}
      >
        {leaves.map((leaf, i) => (
          <div
            key={i}
            ref={(el) => {
              leafRefs.current[i] = el;
            }}
            className="book__leaf"
          >
            <div className="book__face book__face--front">
              {leaf.front ? (
                <Image
                  src={leaf.front.src}
                  alt={leaf.front.alt}
                  width={leaf.front.width}
                  height={leaf.front.height}
                  sizes="(max-width: 768px) 45vw, 32vw"
                  priority={i === 0}
                  draggable={false}
                />
              ) : null}
            </div>
            <div className="book__face book__face--back">
              {leaf.back ? (
                <Image
                  src={leaf.back.src}
                  alt={leaf.back.alt}
                  width={leaf.back.width}
                  height={leaf.back.height}
                  sizes="(max-width: 768px) 45vw, 32vw"
                  draggable={false}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <p className="text-label text-ink-muted mt-6 flex justify-center gap-6 uppercase">
        <span>Drag to turn</span>
        <span>
          {spreadLabel} / {pages.length}
        </span>
      </p>
    </div>
  );
}
