import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  
  outputFileTracingRoot: __dirname, // أو مسار root الأساسي
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahl-izz.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'ahlel-izz.com',
      },
      {
        protocol: 'https',
        hostname: 'www.ahlel-izz.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // Disable optimization for local images to fix Vercel issue
    // Ensure images work on Vercel
    loader: 'default',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Optimize for Vercel
  poweredByHeader: false,
  compress: true,
  // Ensure static files are served correctly
  trailingSlash: false,
  // Add support for static image optimization
  experimental: {
    // optimizeCss: true, // Removed - causes build error on Vercel
  },
  // Ensure public files are accessible
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Add support for static file serving
  async rewrites() {
    return [
      {
        source: '/images/:path*',
        destination: '/images/:path*',
      },
    ]
  },
  // Ensure static files are properly served
  async redirects() {
    return []
  },
}

export default nextConfig