import type { SanitizedConfig } from 'payload'
import payload from 'payload'
import type { Category } from './payload-types'

const categories: Omit<Category, 'id' | 'updatedAt' | 'createdAt'>[] = [
  {
    name: 'Marketing',
    slug: 'marketing',
    featured: false,
  },
  {
    name: 'Technology',
    slug: 'technology',
    featured: false,
  },
  {
    name: 'Business',
    slug: 'business',
    featured: true,
  },
  {
    name: 'Design',
    slug: 'design',
    featured: false,
  },
  {
    name: 'Development',
    slug: 'development',
    featured: false,
  },
  {
    name: 'Flyers',
    slug: 'flyers',
    featured: true,
  },
  {
    name: 'Packaging',
    slug: 'packaging',
    featured: true,
  },
  {
    name: 'Stickers',
    slug: 'stickers',
    featured: false,
  },
  {
    name: 'Banners',
    slug: 'banners',
    featured: false,
  },
]

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })

  // * Seed Admin User
  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@admin.com',
      password: 'admin',
    },
  })
  payload.logger.info('✅ Successfully admin user seeded!')

  // * Seed Company Global
  await payload.updateGlobal({
    slug: 'company',
    data: {
      name: 'CRSNY',
      tagline: 'Your trusted partner in digital transformation',
      description:
        'CRSNY is a digital transformation company that helps businesses leverage technology to achieve their goals.',
      contactInfo: {
        primaryEmail: 'info@crsny.com',
        secondaryEmail: 'support@crsny.com',
        primaryPhone: '+1234567890',
        secondaryPhone: '+1234567890',
        address: '123 Main St, Anytown, USA',
        zipCode: '10001',
        city: 'Anytown',
        state: 'CA',
        country: 'United States',
      },
      socialMedia: {
        facebook: 'https://www.facebook.com',
        instagram: 'https://www.instagram.com',
        twitter: 'https://www.twitter.com',
        linkedin: 'https://www.linkedin.com',
      },
      businessInfo: {
        founded: new Date('1990-01-01').toISOString(),
        industry: 'E-Commerce',
        size: '1-10',
        taxId: '123456789',
      },
      seo: {
        metaTitle: 'CRSNY',
        metaDescription: 'Your trusted partner in digital transformation',
        keywords: 'digital transformation, technology, e-commerce',
      },
    },
  })
  payload.logger.info('✅ Successfully company global seeded!')

  // * Seed Category Collection
  for (const category of categories) {
    await payload.create({
      collection: 'categories',
      data: category,
    })
    payload.logger.info(`✅ Seeded Category: ${category.name}`)
  }
  payload.logger.info('✅ Successfully category collection seeded!')

  process.exit(0)
}
