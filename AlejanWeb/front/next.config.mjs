/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint errors. We can fix/lint locally.
    ignoreDuringBuilds: true
  },
  typescript: {
    // Allow production builds to successfully complete even if
    // there are type errors. We can fix them incrementally.
    ignoreBuildErrors: true
  }
}

export default nextConfig
