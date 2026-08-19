import type { ReactNode } from "react";

/**
 * 와이어프레임 전용 자리표시 블록.
 *
 * 사진·본문이 들어오기 전까지 "무엇이 어디에 앉는지"만 보이게 한다.
 * 콘텐츠가 채워지는 순서대로 이 컴포넌트를 걷어내면 된다.
 */
interface SlotProps {
  label: string;
  /** CSS aspect-ratio 값 — "16/9", "1", "3/4" */
  ratio?: string;
  /** 비율 대신 최소 높이를 줄 때 */
  minHeight?: string;
  note?: string;
  className?: string;
  children?: ReactNode;
}

export function Slot({ label, ratio, minHeight, note, className = "", children }: SlotProps) {
  return (
    <div
      className={`text-ink-muted border-ink-muted/50 relative flex flex-col justify-between border border-dashed p-3 ${className}`}
      style={{ aspectRatio: ratio, minHeight }}
    >
      <span className="text-label uppercase">{label}</span>
      {note ? <span className="text-label max-w-[24ch] normal-case">{note}</span> : null}
      {children}
    </div>
  );
}

/** 섹션 제목 — 와이어프레임에서 구획을 읽히게 하는 용도 */
export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="text-label text-ink-muted mb-4 uppercase">{children}</h2>;
}
