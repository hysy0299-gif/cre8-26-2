"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import OptionWheel from "@/components/option-wheel";
import type { Destination } from "@/data/site";

interface MainWheelNavProps {
  destinations: Destination[];
  defaultSelected?: number;
  /** 휠이 지나가는 항목을 바깥(메인 비주얼 등)에 알린다 */
  onPreview?: (destination: Destination) => void;
}

/**
 * 메인화면의 목적지 선택 장치.
 *
 * 휠을 돌리는 동안 이동하면 지나가는 화면마다 라우팅이 걸리므로,
 * 지나가는 항목은 prefetch만 하고 실제 이동은 확정(가운데 클릭 / Enter) 시에만 한다.
 */
export function MainWheelNav({ destinations, defaultSelected = 0, onPreview }: MainWheelNavProps) {
  const router = useRouter();
  const [, setActive] = useState(defaultSelected);

  const handleChange = useCallback(
    (index: number) => {
      const dest = destinations[index];
      if (!dest) return;
      setActive(index);
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
      // 색은 Design System(3단계)에서 토큰으로 교체한다. 지금은 기본 배경에서 보이기만 하는 임시값.
      textColor="#8a8a8a"
      activeColor="#111111"
    />
  );
}
