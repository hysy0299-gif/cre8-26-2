"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * 아무 입력이 없으면 3분할 화면으로 돌려보낸다.
 *
 * 전시장에 놓고 쓰는 화면이라, 앞 사람이 아카이브 중간쯤 열어두고 가버리면
 * 다음 사람은 그 상태부터 보게 된다. 일정 시간 손을 안 대면 되돌린다.
 *
 * 돌아가는 곳은 첫 화면(/)이 아니라 3분할(/home)이다.
 * 첫 화면은 매니페스토를 다 읽고 벽까지 열어야 넘어가는 긴 스크롤이라,
 * 다음 사람을 매번 그 앞에 세우면 세 갈래로 가는 길이 멀어진다.
 *
 * 움직임·누름·스크롤 무엇이든 활동으로 치고 타이머를 다시 잰다.
 * 돌아갈 자리(3분할)에서는 잴 필요가 없으니 아예 걸지 않는다.
 */
const IDLE_MS = 15_000;

/** 이 중 하나라도 일어나면 아직 사람이 보고 있는 것으로 본다 */
const ACTIVITY = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

export function IdleReset({ home = "/home" }: { home?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (pathname === home) return;

    const reset = () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        router.push(home);
        // 클라이언트 이동이라 스크롤이 남을 수 있다. 3분할은 맨 위에서 시작해야 한다
        window.scrollTo(0, 0);
      }, IDLE_MS);
    };

    reset();
    for (const type of ACTIVITY) {
      window.addEventListener(type, reset, { passive: true });
    }

    return () => {
      for (const type of ACTIVITY) window.removeEventListener(type, reset);
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [pathname, home, router]);

  return null;
}
