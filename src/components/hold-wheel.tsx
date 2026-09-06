"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import OptionWheel from "@/components/option-wheel";
import type { Hold, MediaItem } from "@/types/hold";

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
const FONT_SIZE = { sm: 3.2, md: 4.8, lg: 6.9 } as const;

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
 * 휠을 화면 세로 정중앙에 앉히기 위한 보정값.
 *
 * sticky만 걸면 스크롤 전에는 문서 흐름 위치(네비·헤더 아래)에 그대로 있어서
 * 첫 화면에서 휠이 아래로 처져 보인다. 위에 뭐가 얼마나 쌓였는지를 재서
 * 높이를 `100dvh - 그 값의 두 배`로 잡고 sticky top을 그 값으로 주면,
 * 스크롤 전이든 후든 가운데가 정확히 50dvh에 온다.
 */
function useTopOffset() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      setOffset(Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY)));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return { ref, offset };
}

/**
 * 홀드 표시 높이(vh).
 *
 * 높이를 하나로 묶으면 SPROUT처럼 세로로 긴 홀드는 폭이 좁아 작아 보이고,
 * 남는 높이를 다 주면 정사각 홀드가 화면을 잡아먹는다.
 * 그래서 **면적**을 기준으로 맞춘다 — 정사각을 SQUARE_VH로 두고
 * 가로세로비 r에 대해 높이를 SQUARE_VH / sqrt(r)로 잡으면 넓이가 엇비슷해진다.
 */
const SQUARE_VH = 58;
/** 가장 큰 홀드도 아래 설명에 닿지 않는 선 */
const MAX_VH = 68;

/**
 * 설명 글의 윗변 위치(화면 기준 vh).
 *
 * 홀드는 50dvh를 중심으로 놓이니 가장 큰 홀드의 아랫변이 50 + MAX_VH/2 = 76vh다.
 * 그 바로 아래에 고정으로 둔다 — 홀드마다 따라 움직이면 글이 위아래로 널뛴다.
 */
const TEXT_TOP_VH = 50 + MAX_VH / 2 + 2.5;

/**
 * 상세 뷰 사진의 높이(vh).
 *
 * 대표 이미지는 배경을 딴 컷아웃이라 홀드가 프레임을 꽉 채우지만,
 * 뷰는 배경이 살아 있는 사진이라 같은 높이로 놓으면 그 안의 홀드가 절반으로 보인다.
 * 사진을 자르지 않기로 했으므로 대신 사진 자체를 한계까지 키운다 —
 * 그 한계가 곧 MAX_VH다(그보다 크면 아래 설명 글에 닿는다).
 */
const VIEW_VH = MAX_VH;

/**
 * 그림이 놓이는 자리의 폭(vh).
 *
 * 홀드마다 폭이 달라서, 그림을 칸 한가운데 그냥 두면 홀드를 넘길 때마다
 * 좌우로 흔들린다. 가장 넓은 홀드가 들어갈 만큼을 고정으로 잡아두고
 * 그 안에서 가운데 정렬하면 흔들리지 않는다.
 */
const STAGE_VW = 70;
/** 썸네일 줄의 폭과 그림과의 간격 */
const THUMB_LANE = "5rem";
const THUMB_GAP = "3rem";
/**
 * 줄 전체를 왼쪽으로 미는 양.
 *
 * 그림만 더 왼쪽으로 보내고 썸네일은 제자리에 두려면 둘을 같이 만져야 한다 —
 * THUMB_GAP을 X만큼 넓히면 줄이 X만큼 넓어지고, 가운데 정렬이라
 * 그림은 X/2 왼쪽·썸네일은 X/2 오른쪽으로 간다. 여기서 X/2를 더 밀면
 * 그림은 X만큼 왼쪽으로 가고 썸네일은 원래 자리에 남는다.
 */
const SHIFT_LEFT = "3.25rem";

function holdHeightVh(width: number, height: number) {
  const r = width / height;
  return Math.min(MAX_VH, SQUARE_VH / Math.sqrt(r));
}

/**
 * 아카이브 탐색 — 왼쪽 키워드 휠, 오른쪽 홀드와 설명.
 *
 * 스크롤/드래그로 휠을 돌리면 오른쪽 그림이 바뀐다.
 * 홀드 상세 페이지는 없앴다 — 내용이 안 채워진 자리표시 화면이라 걷어냈다.
 */
export function HoldWheel({ holds }: { holds: Hold[] }) {
  const fontSize = useWheelFontSize();
  const { ref: colRef, offset } = useTopOffset();
  const [index, setIndex] = useState(0);
  /** 상세 뷰가 여러 장인 홀드에서 지금 보고 있는 장 */
  const [view, setView] = useState(0);

  const handleChange = useCallback((i: number) => {
    setIndex(i);
    // 홀드가 바뀌면 대표 이미지로 되돌린다 — 앞 홀드의 3번째 뷰가 남아 있으면 헷갈린다
    setView(0);
  }, []);

  const active = holds[index];
  /**
   * 썸네일이 걸리는 건 뷰가 두 장 이상일 때뿐.
   * useMemo로 감싸는 건 아래 preload가 이걸 의존성으로 잡기 때문 —
   * 매 렌더마다 새 빈 배열이 나오면 preload도 매번 다시 계산된다.
   */
  const views = useMemo(() => active?.views ?? [], [active]);
  const shown = views[view] ?? active?.hero;

  /**
   * 미리 받아둘 그림 — 바로 옆 홀드 둘과, 지금 홀드의 나머지 뷰.
   * 전부 걸면 17종 수백 KB씩이라 첫 진입이 무거워진다. 곧 볼 것만 담는다.
   */
  const preload = useMemo(() => {
    const out: MediaItem[] = [];
    for (const step of [1, -1]) {
      const hero = holds[index + step]?.hero;
      if (hero) out.push(hero);
    }
    for (const [i, v] of views.entries()) if (i !== view) out.push(v);
    return out;
  }, [holds, index, views, view]);

  return (
    <div className="relative grid grid-cols-12 gap-[var(--grid-gutter)]">
      <div ref={colRef} className="col-span-12 md:col-span-5">
        <div
          // 오른쪽으로 조금 밀어 왼쪽 여백을 준다. 위로 올리는 건 예전 그대로
          className="sticky h-[60vh] -translate-y-[2.5vh] translate-x-6 md:h-[var(--wheel-h)]"
          style={
            { top: offset, "--wheel-h": `calc(100dvh - ${offset * 2}px)` } as CSSProperties
          }
        >
          <OptionWheel
            items={holds.map((h) => h.name)}
            defaultSelected={0}
            onChange={handleChange}
            side="left"
            fontSize={fontSize}
            spacing={1.75}
            curve={1.1}
            tilt={6.5}
            blur={3}
            fade={0.33}
            smoothing={260}
            inset={36}
            loop={false}
            draggable
            ariaLabel="Holds"
            // 선택 여부로 색을 바꾸지 않는다 — 둘 다 잉크색
            textColor="var(--color-ink)"
            activeColor="var(--color-ink)"
          />
        </div>
      </div>

      {/*
        한 화면에 딱 맞춘다. 높이를 min이 아니라 고정으로 잡아야
        오른쪽에 커서를 두고 굴려도 페이지가 안 밀린다.
      */}
      <div
        className="relative col-span-12 md:col-span-7"
        style={{ height: `calc(100dvh - ${offset}px)` }}
      >
        {/*
          그림과 썸네일을 한 줄로 묶는다.

          휠과 같은 계산으로 높이를 잡는다 — 이 줄의 가운데가 정확히 50dvh다.
          그래야 홀드 중심과 휠 중심이 같은 가로선에 놓인다.
        */}
        <div
          className="flex w-full items-center justify-center"
          style={{
            height: `calc(100dvh - ${offset * 2}px)`,
            transform: `translateX(-${SHIFT_LEFT})`,
          }}
        >
          {/*
            그림 자리는 폭을 고정한다. 홀드마다 폭이 달라서 그냥 가운데 두면
            넘길 때마다 좌우로 흔들린다.
          */}
          <div className="relative h-full shrink-0" style={{ width: `${STAGE_VW}vh` }}>
            {active ? (
              <figure
                key={`${active.slug}-${view}`}
                className="hold-swap absolute inset-0 flex items-center justify-center"
              >
                {active.model ? (
                  <div className="h-full w-full">
                    <ModelViewer url={active.model} />
                  </div>
                ) : shown ? (
                  <Image
                    src={shown.src}
                    alt={shown.alt}
                    width={shown.width}
                    height={shown.height}
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 62vw"
                    className="w-auto object-contain"
                    style={{
                      // 0번은 대표 이미지(컷아웃), 그 뒤는 사진 — 크기 기준이 다르다
                      maxHeight: `min(100%, ${view > 0 ? VIEW_VH : holdHeightVh(shown.width, shown.height)}vh)`,
                    }}
                  />
                ) : null}
              </figure>
            ) : null}
          </div>

          {/*
            썸네일 줄 — 그림 자리 바로 옆에 붙인다.
            칸 오른쪽 끝에 따로 떨어뜨리면 그림과 한 덩어리로 안 읽힌다.
            figure 밖에 두는 건 장을 바꿀 때 같이 다시 그려지지 않게 하려는 것.
          */}
          {views.length > 1 ? (
            <div
              className="flex shrink-0 flex-col gap-1.5"
              style={{ width: THUMB_LANE, marginLeft: THUMB_GAP }}
            >
              {views.map((v, i) => (
                <button
                  key={v.src}
                  type="button"
                  onClick={() => setView(i)}
                  aria-label={v.alt}
                  aria-current={i === view ? "true" : undefined}
                  // 테두리나 밑줄을 두르지 않는다 — 흰 사진 위에서 검은 선으로 읽힌다.
                  // 지금 보는 장은 진하기로만 구분한다
                  className={`relative aspect-square w-full overflow-hidden bg-white transition-opacity ${
                    i === view ? "opacity-100" : "opacity-40 hover:opacity-75"
                  }`}
                >
                  {/*
                    넷 다 같은 타일로 맞춘다 — 대표 이미지는 배경을 딴 컷아웃이고
                    나머지는 배경이 있는 사진이라, contain으로 두면 첫 칸만
                    바탕에 떠 있어서 줄이 따로 논다. cover면 같은 판으로 읽힌다.
                  */}
                  <Image src={v.src} alt="" fill quality={90} sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/*
          다음에 볼 그림을 미리 받아둔다.
          홀드 한 장이 수백 KB라, 휠을 돌린 뒤에야 요청하면 빈 화면이 먼저 보인다.
          바로 옆 홀드와 지금 홀드의 나머지 뷰를 같은 크기로 미리 걸어두면
          브라우저가 캐시에서 바로 꺼내 쓴다. 눈에는 안 보이고 읽히지도 않는다.
        */}
        <div aria-hidden className="pointer-events-none absolute h-0 w-0 overflow-hidden">
          {preload.map((m) => (
            <Image
              key={m.src}
              src={m.src}
              alt=""
              width={m.width}
              height={m.height}
              quality={90}
              sizes="(max-width: 768px) 100vw, 62vw"
            />
          ))}
        </div>

        {/*
          설명은 흐름에서 빼서 고정 위치에 건다.
          흐름에 두면 글 높이만큼 홀드가 위로 밀려 휠과 중심이 어긋난다.

          홀드 중심에 맞춘다. 썸네일 줄이 붙으면 그림이 그만큼 왼쪽으로 밀리므로,
          글도 같은 만큼(썸네일 폭+간격의 절반) 따라 옮겨야 그림 아래 가운데가 된다.
          폭은 글에 맡긴다(w-max) — 칸 폭에 가두면 긴 문장이 세 줄 네 줄이 된다.
        */}
        {active?.description.length ? (
          <div
            className="text-ink absolute flex w-max max-w-[92vw] -translate-x-1/2 flex-col gap-1 text-center text-[clamp(0.75rem,1.15vw,1rem)] leading-relaxed"
            style={{
              top: `calc(${TEXT_TOP_VH}dvh - ${offset}px)`,
              left:
                views.length > 1
                  ? `calc(50% - (${THUMB_LANE} + ${THUMB_GAP}) / 2 - ${SHIFT_LEFT})`
                  : `calc(50% - ${SHIFT_LEFT})`,
            }}
          >
            {active.description.map((line, i) => (
              // 좁은 화면에서는 줄바꿈을 허용한다 — 안 그러면 글자가 읽을 수 없게 작아진다
              <p key={i} className="md:whitespace-nowrap">
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>

    </div>
  );
}
