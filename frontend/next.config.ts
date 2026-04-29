import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: "standalone",
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
