import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },

  // Webpack configuration for better video handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },

  // HTTPS redirects (production only)
  async redirects() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          has: [
            {
              type: 'header',
              key: 'x-forwarded-proto',
              value: 'http',
            },
          ],
          destination: 'https://:host/:path*',
          permanent: true,
        },
      ];
    }
    return [];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Disable dangerous browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          // Force HTTPS (HSTS)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              // Default: only allow same-origin
              "default-src 'self'",
              // Scripts: allow self and necessary inline scripts
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== 'production' ? " 'unsafe-eval'" : ''}`,
              // Styles: allow self and inline styles (needed for CSS-in-JS)
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              // Images: allow self and data URLs
              "img-src 'self' data: blob:",
              // Media: allow self for videos and audio
              "media-src 'self' data: blob:",
              // Fonts: allow self and Google Fonts
              "font-src 'self' fonts.gstatic.com",
              // Connect: allow self
              "connect-src 'self'",
              // Object, embed, base: block all
              "object-src 'none'",
              "embed-src 'none'",
              "base-uri 'self'",
              // Forms: only submit to same origin
              "form-action 'self'",
              // Frames: allow specific sources if needed (currently none)
              "frame-src 'none'",
              // Upgrade insecure requests in production
              ...(process.env.NODE_ENV === 'production' ? ['upgrade-insecure-requests'] : []),
              // Insert new frame-ancestors directive
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
