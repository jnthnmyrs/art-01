import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      { canvas: "canvas" }
    ];

    // Optionally, you might also need this resolver
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'paper': 'paper/dist/paper-core.js'
      },
    };

    return config;
  },
};

export default nextConfig;
