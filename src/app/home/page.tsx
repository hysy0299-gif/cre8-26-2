import { FlowingMenu } from "@/components/flowing-menu";
import { destinations } from "@/data/site";

/**
 * MAIN — 랜딩 다음에 오는 갈림 화면.
 * 네 갈래가 화면을 가로로 나눠 갖고, 각 띠에 커서를 올리면
 * 들어온 모서리 방향에서 마퀴가 밀려 나온다.
 *
 * 색은 지정값 그대로. marqueeBg(#bbccc7)만 GRIT 팔레트 4색 밖의 값이다.
 */
export default function MainPage() {
  return (
    <div data-screen="main" className="h-dvh">
      <FlowingMenu
        items={destinations.map((d) => ({ link: d.href, text: d.label, image: d.image }))}
        textColor="#010101"
        bgColor="#f5f5f5"
        marqueeBgColor="#bbccc7"
        marqueeTextColor="#f5f5f5"
        borderColor="#f5f5f5"
      />
    </div>
  );
}
