"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import OptionWheel from "@/components/option-wheel";
import type { Hold } from "@/types/hold";

/**
 * 휠 라벨 크기(rem).
 * 휠은 행 높이를 fontSize에서 px로 계산하므로 CSS clamp을 못 쓴다.
 * 폭 구간별로 값을 바꿔 끼우면 휠이 알아서 다시 배치된다.
 */
const FONT_SIZE = { sm: 1.9, md: 2.7, lg: 3.7 } as const;

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
 * 아카이브 탐색 — 왼쪽 키워드 휠, 오른쪽 홀드.
 *
 * 스크롤/드래그로 휠을 돌리면 오른쪽 오브제가 바뀐다.
 * 가운데 키워드를 한 번 더 누르거나 Enter를 치면 그 홀드의 상세로 들어간다.
 * 지나가는 항목마다 라우팅하면 안 되므로 통과 시엔 prefetch만 한다.
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
    <div className="grid min-h-[72vh] grid-cols-12 gap-[var(--grid-gutter)]">
      <div className="col-span-12 min-h-[50vh] md:col-span-5 md:min-h-0">
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

      <div className="col-span-12 flex min-h-0 flex-col justify-center md:col-span-7">
        {active?.hero ? (
          <figure key={active.slug} className="hold-swap flex flex-col gap-4">
            <Image
              src={active.hero.src}
              alt={active.hero.alt}
              width={active.hero.width}
              height={active.hero.height}
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className="max-h-[60vh] w-full object-contain"
            />
            <figcaption className="text-label text-ink-muted flex justify-between uppercase">
              <span>{active.index}</span>
              <span>
                {index + 1} / {holds.length}
              </span>
            </figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}
