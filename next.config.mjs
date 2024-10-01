/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  productionBrowserSourceMaps: true,
};

export default nextConfig;
