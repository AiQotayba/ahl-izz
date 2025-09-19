import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disable optimization for local images to fix Vercel issue
  },
  poweredByHeader: false,
  compress: true,
}

export default nextConfig