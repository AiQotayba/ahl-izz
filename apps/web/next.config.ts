import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  
  outputFileTracingRoot: __dirname, // أو مسار root الأساسي
  images: {
    domains: ['localhost' ,"ahl-izz.vercel.app","ahlel-izz.com"],
    formats: ['image/webp', 'image/avif'],
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
}

export default nextConfig