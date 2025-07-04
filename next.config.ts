import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Handle Node.js dependencies that shouldn't be bundled for the browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      path: false,
      os: false,
      crypto: false
    };

    // Fix Konva module resolution issues  
    config.resolve.alias = {
      ...config.resolve.alias,
      'konva/lib/Core.js': 'konva/lib/Core'
    };

    return config;
  }
};

export default nextConfig;
