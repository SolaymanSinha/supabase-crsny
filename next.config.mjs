import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },

  serverExternalPackages: ['pino', 'pino-pretty'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '', // leave empty unless you use a specific port
        pathname: '/**', // match any path
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // leave empty unless you use a specific port
        pathname: '/**', // match any path
      },
      {
        protocol: 'https',
        hostname: 'supabase-crsny.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'crsny-app.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'crsprintingsing.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
