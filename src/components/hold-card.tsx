import { Fragment } from "react";
import Link from "next/link";
import { Slot } from "@/components/wireframe";
import type { Hold } from "@/types/hold";

const SPEC_KEYS = ["form", "material", "surface", "interaction"] as const;

/**
 * 아카이브 그리드의 한 칸.
 * 이미지 아래에 spec 4줄을 그대로 노출한다 — 이게 쇼핑몰 카드와 연구 샘플을 가르는 지점이다.
 */
export function HoldCard({ hold }: { hold: Hold }) {
  return (
    <Link href={`/archive/${hold.slug}`} className="flex flex-col gap-4">
      <Slot label={hold.index} ratio="3/4" />
      <dl className="text-label grid grid-cols-[5.5rem_1fr] gap-y-1 uppercase">
        {SPEC_KEYS.map((key) => (
          <Fragment key={key}>
            <dt className="text-ink-muted">{key}</dt>
            <dd>{hold.spec[key]}</dd>
          </Fragment>
        ))}
      </dl>
    </Link>
  );
}
