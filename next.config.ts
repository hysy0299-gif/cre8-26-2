import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 홀드 사진은 화면 높이에 맞춰 커진다. 기본 목록에는 2048 위가 없어서
    // 고해상도 화면에서 작은 변형이 늘어나 뭉개졌다.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2048, 2560, 3200],
    // 홀드는 quality 90으로 내보낸다. Next 16은 여기 없는 값을 쓰면 에러를 낸다
    qualities: [75, 90],
  },
};

export default nextConfig;
