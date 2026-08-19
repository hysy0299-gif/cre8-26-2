"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import type { MediaItem } from "@/types/hold";
import "./page-flip.css";

/**
 * 드래그로 넘기는 책.
 *
 * 종이 한 장(leaf)이 앞뒤 두 쪽을 갖는다 — 19쪽이면 10장, 마지막 장의 뒷면은 비어 있다.
 * 각 장은 책등(왼쪽 모서리)을 축으로 rotateY 하고, 넘긴 장은 -180도에서 왼쪽에 쌓인다.
 *
 * 오른쪽을 왼쪽으로 끌면 앞으로, 왼쪽을 오른쪽으로 끌면 뒤로 넘어간다.
 * 놓았을 때 절반을 넘겼으면 마저 넘어가고 아니면 되돌아온다. 그냥 클릭해도 한 장 넘어간다.
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
const TURN_DURATION = 0.55;

export function PageFlip({ pages, className = "" }: PageFlipProps) {
  const leaves = useMemo<Leaf[]>(() => {
    const out: Leaf[] = [];
    for (let i = 0; i < pages.length; i += 2) {
      out.push({ front: pages[i], back: pages[i + 1] });
    }
    return out;
  }, [pages]);

  const bookRef = useRef<HTMLDivElement | null>(null);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef<{
    leaf: number;
    startX: number;
    moved: number;
    forward: boolean;
    pointerId: number;
  } | null>(null);

  /** 넘긴 장수 */
  const [turned, setTurned] = useState(0);
  const turnedRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // 포인터 핸들러가 최신 값을 읽어야 해서 ref로도 들고 있는다.
  // 렌더 중에 ref를 쓰면 React 규칙 위반이라 이펙트로 미룬다.
  useEffect(() => {
    turnedRef.current = turned;
  });

  const pageWidth = () => (bookRef.current?.offsetWidth ?? 2) / 2;

  /** 넘긴 장은 나중 것이 위로, 안 넘긴 장은 앞 것이 위로 쌓인다 */
  const zIndexFor = useCallback(
    (i: number, turnedCount: number) => (i < turnedCount ? i + 1 : leaves.length - i),
    [leaves.length],
  );

  // turned가 바뀌면 각 장을 제자리로 돌린다. 드래그 중인 장은 손이 잡고 있으므로 건드리지 않는다.
  useEffect(() => {
    leafRefs.current.forEach((el, i) => {
      if (!el || dragRef.current?.leaf === i) return;
      el.style.zIndex = String(zIndexFor(i, turned));
      gsap.to(el, {
        rotateY: i < turned ? -180 : 0,
        duration: TURN_DURATION,
        ease: "power2.inOut",
      });
    });
  }, [turned, zIndexFor]);

  const setRotation = (i: number, deg: number) => {
    const el = leafRefs.current[i];
    if (el) gsap.set(el, { rotateY: deg });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const book = bookRef.current;
    if (!book) return;

    const rect = book.getBoundingClientRect();
    const onRightHalf = e.clientX - rect.left > rect.width / 2;
    const current = turnedRef.current;

    // 오른쪽 절반은 아직 안 넘긴 첫 장, 왼쪽 절반은 마지막으로 넘긴 장을 집는다
    const leaf = onRightHalf ? current : current - 1;
    if (leaf < 0 || leaf >= leaves.length) return;

    dragRef.current = {
      leaf,
      startX: e.clientX,
      moved: 0,
      forward: onRightHalf,
      pointerId: e.pointerId,
    };
    setIsDragging(true);
    book.setPointerCapture(e.pointerId);

    const el = leafRefs.current[leaf];
    if (el) el.style.zIndex = String(leaves.length + 1);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    drag.moved = Math.max(drag.moved, Math.abs(dx));

    const w = pageWidth();
    const progress = drag.forward
      ? Math.min(Math.max(-dx / w, 0), 1)
      : Math.min(Math.max(dx / w, 0), 1);

    setRotation(drag.leaf, drag.forward ? -180 * progress : -180 * (1 - progress));
  };

  const finishDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setIsDragging(false);
    bookRef.current?.releasePointerCapture(drag.pointerId);

    const dx = e.clientX - drag.startX;
    const w = pageWidth();
    const progress = drag.forward
      ? Math.min(Math.max(-dx / w, 0), 1)
      : Math.min(Math.max(dx / w, 0), 1);

    // 거의 안 움직였으면 넘기려고 누른 것으로 본다
    const commit = drag.moved < CLICK_SLOP || progress > COMMIT_AT;
    const next = commit ? (drag.forward ? drag.leaf + 1 : drag.leaf) : turnedRef.current;

    if (next === turnedRef.current) {
      // 상태가 그대로면 위 이펙트가 안 돌아 되돌리는 애니메이션을 직접 건다
      const el = leafRefs.current[drag.leaf];
      if (el) {
        gsap.to(el, {
          rotateY: drag.forward ? 0 : -180,
          duration: TURN_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            el.style.zIndex = String(zIndexFor(drag.leaf, turnedRef.current));
          },
        });
      }
    } else {
      setTurned(next);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setTurned((t) => Math.min(t + 1, leaves.length));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setTurned((t) => Math.max(t - 1, 0));
    }
  };

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
        <div className="book__base" />

        {leaves.map((leaf, i) => (
          <div
            key={i}
            ref={(el) => {
              leafRefs.current[i] = el;
            }}
            className="book__leaf"
            style={{ zIndex: zIndexFor(i, turned) }}
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
          {Math.min(turned * 2 + 1, pages.length)} / {pages.length}
        </span>
      </p>
    </div>
  );
}
