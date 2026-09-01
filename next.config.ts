import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 홀드 사진은 화면 높이에 맞춰 커진다. 기본 목록에는 2048 위가 없어서
    // 고해상도 화면에서 작은 변형이 늘어나 뭉개졌다.
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2048, 2560, 3200],
  },
};

export default nextConfig;
