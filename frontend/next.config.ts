import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",              // cualquier llamada a /api/*
        destination: "http://192.168.1.75:5000/api/:path*", // se redirige al backend
      },
    ];
  },
};

export default nextConfig;