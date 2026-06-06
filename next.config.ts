import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  basePath: "/nairobi-health-equity-map",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
