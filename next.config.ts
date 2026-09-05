import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 루트는 아카이빙 웹사이트다. 전시(인터랙션) 페이지는
  // /exhibition/grit-wall.html 로 따로 열린다 — 한 배포에 둘이 같이 산다.
  //
  // 예전에 루트를 전시로 보내는 redirect가 있었는데, 그러면 팀원이 링크를 열었을 때
  // 사이트가 아니라 전시가 떠서 뺐다.
  images: {
    // 홀드 사진은 화면 높이에 맞춰 커진다. 기본 목록에는 2048 위가 없어서
    // 고해상도 화면에서 작은 변형이 늘어나 뭉개졌다.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2048, 2560, 3200],
    // 홀드는 quality 90으로 내보낸다. Next 16은 여기 없는 값을 쓰면 에러를 낸다
    qualities: [75, 90],
  },
};

export default nextConfig;
