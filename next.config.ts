import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이 배포는 게스트 인터랙션만 내보낸다. 사이트 파일은 저장소에 그대로
  // 있지만 주소로는 안 나온다.
  //
  // rewrite가 아니라 redirect다. rewrite는 app 라우터의 페이지보다 나중에
  // 걸려서 루트가 계속 사이트 메인으로 잡혔다.
  async redirects() {
    return [
      { source: "/", destination: "/exhibition/grit-wall.html", permanent: false },
    ];
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
