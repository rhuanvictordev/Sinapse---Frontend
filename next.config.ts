import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: "/sinapse/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND}/:path*`,
      },
    ];
  },
};

export default nextConfig;