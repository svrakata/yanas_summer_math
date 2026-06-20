import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // fully static — deployable to Vercel/any CDN
  images: { unoptimized: true },
  reactCompiler: true,
  trailingSlash: true,
};

export default nextConfig;
