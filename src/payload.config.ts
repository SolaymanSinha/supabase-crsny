// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Company } from './globals/Company'
import { Categories } from './collections/Categorie'
import { VariantNames } from './collections/VariantNames'
import { VariantValues } from './collections/VariantValues'
import { Product } from './collections/Product'
import { Order } from './collections/Order'
import { s3Storage } from '@payloadcms/storage-s3'
import { WebContents } from './globals/WebContents'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'admin@admin.com',
            password: 'admin',
          }
        : false,
  },
  collections: [Users, Media, Categories, VariantNames, VariantValues, Product, Order],
  globals: [Company, WebContents],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: {
          prefix: 'cms',
        },
      },
      bucket: process.env.S3_BUCKET || 'website',
      config: {
        endpoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:54321/storage/v1/s3',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '625729a08b95bf1b7ff351a663f3a23c',
          secretAccessKey:
            process.env.S3_SECRET_ACCESS_KEY ||
            '850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907',
        },
        region: process.env.S3_REGION || 'local',
        forcePathStyle: true,
      },
    }),
  ],
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seed.ts'),
      key: 'seed',
    },
  ],
})
