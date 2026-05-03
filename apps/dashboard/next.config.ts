/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@trust-node/shared",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
};

export default nextConfig;
