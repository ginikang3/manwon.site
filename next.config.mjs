/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 빌드 중 타입 에러가 있어도 무시하고 진행
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 중 린트 에러가 있어도 무시하고 진행
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;