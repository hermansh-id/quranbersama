import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/isomorphic-ws", "ws"],
};

export default nextConfig;
