import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Externalize canvas for react-konva SSR compatibility
    config.externals = [
      ...(config.externals || []),
      { canvas: false }
    ];
    return config;
  }
};

export default nextConfig;
