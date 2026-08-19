/**
 * HOME — 첫인상과 세계관.
 * 블록 순서만 확정된 상태. 각 블록의 구현은 Component 단계에서 채운다.
 */
export default function HomePage() {
  return (
    <>
      <section data-block="hero" aria-label="Hero visual" />
      <section data-block="statement" aria-label="Project statement" />
      <section data-block="selected-holds" aria-label="Selected holds" />
      <section data-block="material-research" aria-label="Material / tactile research" />
      <section data-block="archive-entry" aria-label="Archive" />
    </>
  );
}
