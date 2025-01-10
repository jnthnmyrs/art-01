import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle canvas dependency for react-konva during SSR
    config.externals = [
      ...(config.externals || []),
      { canvas: "canvas" }
    ];
    return config;
  }
};

export default nextConfig;
