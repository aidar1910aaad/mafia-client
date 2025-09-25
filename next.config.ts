import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mafia-production-0fd1.up.railway.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.mafspace.ru',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    // Отключаем проверку типов при сборке
    ignoreBuildErrors: true,
  },
  eslint: {
    // Отключаем проверку ESLint при сборке
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
