import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@subtracker/db", "@subtracker/parsers"],
};

export default nextConfig;
