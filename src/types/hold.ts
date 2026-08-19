/**
 * Hold 하나 = 하나의 연구 샘플 레코드.
 *
 * spec 4개 항목은 Archive 카드와 Detail이 같은 소스를 공유한다.
 * 그래야 그리드가 product grid가 아니라 샘플 인덱스로 읽힌다.
 */

/** Detail 페이지 섹션 키 — 모든 Hold가 같은 템플릿을 공유한다 */
export type HoldSectionKey =
  | "form"
  | "cmf"
  | "surface"
  | "fabrication"
  | "interaction"
  | "experiment";

/** Process 스테이지 키 — Detail의 Fabrication에서 참조로 연결한다 */
export type ProcessStageKey =
  | "research"
  | "form-exploration"
  | "modeling"
  | "printing"
  | "mold"
  | "casting"
  | "sensor"
  | "exhibition";

export interface HoldSpec {
  form: string;
  material: string;
  surface: string;
  interaction: string;
}

export interface HoldSection {
  key: HoldSectionKey;
  body?: string;
  media: MediaItem[];
}

export interface MediaItem {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Hold {
  /** 표기용 인덱스 — HOLD 01 */
  index: string;
  /** URL 세그먼트 — /archive/[hold] */
  slug: string;
  name: string;
  spec: HoldSpec;
  /** 대표 이미지 — 촬영 전이라 아직 비어 있을 수 있다 */
  hero?: MediaItem;
  sections: HoldSection[];
  /** 이 홀드가 거쳐간 process 스테이지 — 프로세스 내용을 복제하지 않고 참조한다 */
  processRefs: ProcessStageKey[];
  /** Archive 정렬 및 Next Hold 도출 기준 */
  order: number;
}

export interface ProcessStage {
  key: ProcessStageKey;
  title: string;
  body?: string;
  media: MediaItem[];
}
