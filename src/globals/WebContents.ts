import { GlobalConfig } from 'payload'

export const WebContents: GlobalConfig = {
  slug: 'web-contents',
  admin: {
    group: 'Settings',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The hero image of the website',
      },
    },
    {
      name: 'featuredProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'topSellerHero',
      label: 'Top Seller Hero',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The hero image of the top sellers section',
      },
    },
    {
      name: 'topSellerProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    {
      name: 'partnerLogos',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'bestDealsHero',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The hero image of the best deals section',
      },
    },
    {
      name: 'bestDealsProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}
