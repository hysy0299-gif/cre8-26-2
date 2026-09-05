import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이 배포는 게스트 인터랙션만 내보낸다. 첫 화면이 곧 전시 화면이고,
  // 사이트는 여기 없다 — 사이트는 사이트대로 따로 배포한다.
  async rewrites() {
    return [{ source: "/", destination: "/exhibition/grit-wall.html" }];
  },
  images: {
    // 홀드 사진은 화면 높이에 맞춰 커진다. 기본 목록에는 2048 위가 없어서
    // 고해상도 화면에서 작은 변형이 늘어나 뭉개졌다.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2048, 2560, 3200],
    // 홀드는 quality 90으로 내보낸다. Next 16은 여기 없는 값을 쓰면 에러를 낸다
    qualities: [75, 90],
  },
};

export default nextConfig;
