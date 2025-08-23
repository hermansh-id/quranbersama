import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingIncludes: {
    './/': [
      './node_modules/@libsql/darwin/**/*',
      './node_modules/@libsql/linux/**/*',
    ],
  },
  serverExternalPackages: ["@libsql/isomorphic-ws", "ws"],
};

export default nextConfig;
