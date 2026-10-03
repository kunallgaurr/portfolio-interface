import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is a single static page: `next build` writes it to ./out.
  output: "export",
  reactCompiler: true,
};

export default nextConfig;
