import { AccordionGallery } from "@/components/accordion-gallery";
import { mainSections } from "@/data/site";

/**
 * MAIN — 세 갈래로 나뉘는 첫 화면.
 *
 * 세 칸이 같은 높이로 나란히 서고, 커서를 올린 칸이 넓어진다.
 * 사진은 크기가 안 변한다 — 칸이 창처럼 넓어졌다 좁아지며 더 보여주거나 가린다.
 * 접힌 칸을 누르면 펼치기만 하고, 펼쳐진 칸을 다시 누르면 그 화면으로 들어간다.
 *
 * 링크를 열면 처음 보이는 화면이다. 여기가 집이라 뒤로가기를 두지 않는다 —
 * 돌아갈 뒤가 없다. 손을 떼면 어느 화면에서든 다시 이리로 돌아온다(IdleReset).
 * 나가는 길이 필요한 건 안쪽 세 화면 쪽이다.
 */

/**
 * 열린 칸이 안쪽 폭에서 차지할 비율.
 *
 * 이 값이 곧 좌우 여백을 정한다. 열린 칸의 폭은 `높이 × 사진비율`로 고정이니,
 * 비율을 낮출수록 상자가 넓어지고(여백이 줄고) 대신 열림/접힘 차이가 작아진다.
 */
const OPEN_RATIO = 0.42;
const GAP = 10;

/**
 * 상자 비율은 사진에서 나온다.
 * 가장 넓은 사진이 열렸을 때 그 폭이 안쪽 폭의 OPEN_RATIO가 되도록 잡는다.
 * 그래야 어느 칸이 열려도 사진이 잘리지도, 옆에 빈자리가 생기지도 않는다.
 */
const WIDEST = Math.max(
  ...mainSections.map((s) => (s.image ? s.image.width / s.image.height : 0)),
);

export default function MainPage() {
  return (
    <div
      data-screen="main"
      className="relative flex h-dvh items-center justify-center py-[var(--page-margin)]"
    >
      <div className="h-full max-w-full" style={{ aspectRatio: `${WIDEST / OPEN_RATIO}` }}>
        <AccordionGallery
          items={mainSections.map((s) => ({
            label: s.label,
            href: s.href,
            image: s.image,
          }))}
          defaultIndex={1}
          orientation="horizontal"
          height="100%"
          gap={GAP}
          expandRatio={OPEN_RATIO}
          fitOpen
          // 기울이지 않는다 — 세 칸이 같은 높이로 나란히 선다
          tilt={0}
          trigger="hover"
          sizes="(max-width: 520px) 100vw, 40vw"
        />
      </div>
    </div>
  );
}
