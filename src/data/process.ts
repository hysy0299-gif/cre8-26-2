import type { ProcessStage } from "@/types/hold";

/**
 * 프로세스 스테이지. timeline이 아니라 실험 아카이브로 보여주기 위해
 * 각 스테이지가 독립된 미디어 묶음을 갖는다.
 * key는 Hold.processRefs 및 /process#key 앵커와 짝을 이룬다.
 */
export const processStages: ProcessStage[] = [
  { key: "research", title: "Research", media: [] },
  { key: "form-exploration", title: "AI / Form Exploration", media: [] },
  { key: "modeling", title: "Modeling", media: [] },
  { key: "printing", title: "3D Printing", media: [] },
  { key: "mold", title: "Mold", media: [] },
  { key: "casting", title: "Casting / CMF", media: [] },
  { key: "sensor", title: "Sensor Experiment", media: [] },
  { key: "exhibition", title: "Exhibition", media: [] },
];

export const getStage = (key: string) =>
  processStages.find((s) => s.key === key);
