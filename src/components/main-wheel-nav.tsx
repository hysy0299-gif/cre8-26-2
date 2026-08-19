"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import OptionWheel from "@/components/option-wheel";
import type { Destination } from "@/data/site";

interface MainWheelNavProps {
  destinations: Destination[];
  defaultSelected?: number;
  /** 휠이 지나가는 항목을 바깥(메인 비주얼 등)에 알린다 */
  onPreview?: (destination: Destination) => void;
}

/**
 * 휠 라벨 크기(rem).
 * 휠은 rowH를 fontSize에서 px로 계산하므로 CSS clamp을 못 쓴다.
 * 그래서 폭 구간별로 값을 바꿔 끼운다 — 바뀌면 휠이 알아서 다시 배치된다.
 */
const WHEEL_FONT_SIZE = { sm: 1.75, md: 2.5, lg: 3.5 } as const;

function useWheelFontSize() {
  const [size, setSize] = useState<number>(WHEEL_FONT_SIZE.lg);

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      setSize(w < 768 ? WHEEL_FONT_SIZE.sm : w < 1280 ? WHEEL_FONT_SIZE.md : WHEEL_FONT_SIZE.lg);
    };
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  return size;
}

/**
 * 메인화면의 목적지 선택 장치.
 *
 * 휠을 돌리는 동안 이동하면 지나가는 화면마다 라우팅이 걸리므로,
 * 지나가는 항목은 prefetch만 하고 실제 이동은 확정(가운데 클릭 / Enter) 시에만 한다.
 */
export function MainWheelNav({ destinations, defaultSelected = 0, onPreview }: MainWheelNavProps) {
  const router = useRouter();
  const fontSize = useWheelFontSize();

  const handleChange = useCallback(
    (index: number) => {
      const dest = destinations[index];
      if (!dest) return;
      onPreview?.(dest);
      // 확정하기 전에 미리 받아둬서 이동이 끊기지 않게 한다
      router.prefetch(dest.href);
    },
    [destinations, onPreview, router],
  );

  const handleCommit = useCallback(
    (index: number) => {
      const dest = destinations[index];
      if (dest) router.push(dest.href);
    },
    [destinations, router],
  );

  return (
    <OptionWheel
      items={destinations.map((d) => d.label)}
      defaultSelected={defaultSelected}
      onChange={handleChange}
      onCommit={handleCommit}
      side="left"
      loop
      draggable
      ariaLabel="Sections"
      fontSize={fontSize}
      // 커브가 왼쪽으로 파고들 자리를 페이지 여백만큼 준다
      inset="var(--page-margin)"
      // 역할 토큰 참조 — 바탕을 뒤집으면 globals.css의 네 줄만 바꿔도 휠이 따라간다
      textColor="var(--color-ink-muted)"
      activeColor="var(--color-ink)"
    />
  );
}
