"use client";

import { useState } from "react";
import { MainWheelNav } from "@/components/main-wheel-nav";
import { Slot } from "@/components/wireframe";
import type { Destination } from "@/data/site";

/**
 * 메인화면의 휠 + 비주얼 한 쌍.
 * 휠이 지나가는 항목에 맞춰 오른쪽 비주얼이 바뀐다 — 선택이 곧 미리보기다.
 */
export function MainScreen({ destinations }: { destinations: Destination[] }) {
  const [active, setActive] = useState<Destination>(destinations[0]);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-[var(--grid-gutter)] pr-[var(--page-margin)]">
      <div data-block="wheel" className="col-span-12 min-h-0 md:col-span-5">
        <MainWheelNav destinations={destinations} onPreview={setActive} />
      </div>

      <div className="col-span-7 hidden min-h-0 py-[var(--page-margin)] md:block">
        <Slot
          label={`${active.label} — key visual`}
          note="Swaps as the wheel turns. Click the centred label or press Enter to open."
          className="h-full"
        />
      </div>
    </div>
  );
}
