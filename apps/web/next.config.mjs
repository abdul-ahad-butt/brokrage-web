/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: false,
  },
  // Allow images from any https source for cargo images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Transpile the shared-types workspace package
  transpilePackages: ["@freightbridge/shared-types"],
  async redirects() {
    return [
      {
        source: '/agent/dashboard',
        destination: '/agent',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
