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
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { WebContents } from './globals/WebContents'
import { Pages } from './globals/Pages'

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
  globals: [Company, WebContents, Pages],
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
    // INFO: Previously using supbase storage. But the free tier isn't enough the load of the connection of DB. So switched to NeonDB + Uploadthing
    //
    // storage-adapter-placeholder
    // s3Storage({
    //   collections: {
    //     media: {
    //       prefix: 'cms',
    //     },
    //   },
    //   bucket: process.env.S3_BUCKET || '',
    //   config: {
    //     endpoint: process.env.S3_ENDPOINT || '',
    //     credentials: {
    //       accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    //       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    //     },
    //     region: process.env.S3_REGION || '',
    //     forcePathStyle: true,
    //   },
    // }),
    //
    //
    // INFO: Uploadthing Storage Adapter
    uploadthingStorage({
      clientUploads: true,
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
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
