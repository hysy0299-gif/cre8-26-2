"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import OptionWheel from "@/components/option-wheel";
import type { Hold } from "@/types/hold";

/**
 * three는 1MB에 가깝다. 3D가 있는 홀드를 고를 때만 받아오게 해서
 * 아카이브 첫 진입과 나머지 페이지는 예전 그대로 가볍게 둔다.
 */
const ModelViewer = dynamic(() => import("@/components/model-viewer"), {
  ssr: false,
  loading: () => <span className="text-label text-ink-muted uppercase">Loading 3D…</span>,
});

/**
 * 휠 라벨 크기(rem).
 * 휠은 행 높이를 fontSize에서 px로 계산하므로 CSS clamp을 못 쓴다.
 * 폭 구간별로 값을 바꿔 끼우면 휠이 알아서 다시 배치된다.
 */
const FONT_SIZE = { sm: 2.4, md: 3.4, lg: 4.6 } as const;

function useWheelFontSize() {
  const [size, setSize] = useState<number>(FONT_SIZE.lg);

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      setSize(w < 768 ? FONT_SIZE.sm : w < 1280 ? FONT_SIZE.md : FONT_SIZE.lg);
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  return size;
}

/**
 * 아카이브 탐색 — 왼쪽 키워드 휠, 오른쪽 홀드와 설명.
 *
 * 왼쪽 칸은 sticky + 화면 높이라 휠의 가운데가 늘 화면 세로 중앙에 온다.
 * 위에 헤더가 얼마나 오든 휠 위치는 안 흔들린다.
 *
 * 스크롤/드래그로 휠을 돌리면 오른쪽이 바뀐다.
 * 가운데 키워드를 한 번 더 누르거나 Enter를 치면 그 홀드의 상세로 들어간다.
 */
export function HoldWheel({ holds }: { holds: Hold[] }) {
  const router = useRouter();
  const fontSize = useWheelFontSize();
  const [index, setIndex] = useState(0);

  const handleChange = useCallback(
    (i: number) => {
      setIndex(i);
      const hold = holds[i];
      if (hold) router.prefetch(`/archive/${hold.slug}`);
    },
    [holds, router],
  );

  const handleCommit = useCallback(
    (i: number) => {
      const hold = holds[i];
      if (hold) router.push(`/archive/${hold.slug}`);
    },
    [holds, router],
  );

  const active = holds[index];

  return (
    <div className="grid grid-cols-12 gap-[var(--grid-gutter)]">
      <div className="col-span-12 md:col-span-4">
        <div className="sticky top-[var(--nav-pad)] h-[60vh] md:h-[calc(100dvh-var(--nav-pad)*2)]">
          <OptionWheel
            items={holds.map((h) => h.name)}
            defaultSelected={0}
            onChange={handleChange}
            onCommit={handleCommit}
            side="left"
            fontSize={fontSize}
            spacing={1.75}
            curve={1.1}
            tilt={6.5}
            blur={3}
            fade={0.33}
            smoothing={260}
            inset={88}
            loop={false}
            draggable
            ariaLabel="Holds"
            // 흰 바탕이라 원본 예시의 흰색 활성값 대신 역할 토큰을 쓴다
            textColor="var(--color-ink-muted)"
            activeColor="var(--color-ink)"
          />
        </div>
      </div>

      <div className="col-span-12 flex min-h-[calc(100dvh-var(--nav-pad)*2)] flex-col justify-center md:col-span-8">
        {active ? (
          <figure key={active.slug} className="hold-swap flex flex-col gap-8">
            <div className="flex min-h-0 items-center justify-center">
              {active.model ? (
                <div className="h-[58vh] w-full">
                  <ModelViewer url={active.model} />
                </div>
              ) : active.hero ? (
                <Image
                  src={active.hero.src}
                  alt={active.hero.alt}
                  width={active.hero.width}
                  height={active.hero.height}
                  priority

                  quality={90}
                  sizes="(max-width: 768px) 100vw, 62vw"
                  className="max-h-[58vh] w-auto object-contain"
                />
              ) : null}
            </div>

            <figcaption className="flex flex-col gap-4">
              <div className="text-label text-ink-muted flex items-baseline justify-between uppercase">
                <span>
                  {active.index}
                  {active.model ? " · Drag to rotate" : ""}
                </span>
                <span>
                  {index + 1} / {holds.length}
                </span>
              </div>

              {active.description.length ? (
                <div className="text-body flex max-w-[52ch] flex-col gap-3 text-balance">
                  {active.description.map((line, i) => (
                    <p key={i} className={i > 0 ? "text-ink-muted" : undefined}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}
