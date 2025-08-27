import { GlobalConfig } from 'payload'

export const Company: GlobalConfig = {
  slug: 'company',
  admin: {
    group: 'settings',
  },
  access: {
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'The logo of the company',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'A short tagline or slogan for your company',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Company Description',
      admin: {
        description: 'A brief description of your company',
      },
    },
    {
      name: 'contactInfo',
      type: 'group',
      label: 'Contact Information',
      fields: [
        {
          name: 'primaryEmail',
          type: 'email',
          required: true,
          label: 'Primary Email',
        },
        {
          name: 'secondaryEmail',
          type: 'email',
          label: 'Secondary Email',
          admin: {
            description: 'Additional email address (e.g., customer care)',
          },
        },
        {
          name: 'primaryPhone',
          type: 'text',
          required: true,
          label: 'Primary Phone Number',
          admin: {
            description: 'Main support phone number displayed prominently',
          },
        },
        {
          name: 'secondaryPhone',
          type: 'text',
          label: 'Secondary Phone Number',
        },
        {
          name: 'mobilePhone',
          type: 'text',
          label: 'Mobile Phone Number',
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
          label: 'Full Address',
          admin: {
            description: 'Complete office address for footer display',
          },
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          label: 'State/Province',
        },
        {
          name: 'zipCode',
          type: 'text',
          label: 'ZIP/Postal Code',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Country',
        },
      ],
    },

    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter/X URL',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram URL',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
        },
      ],
    },
    {
      name: 'businessInfo',
      type: 'group',
      label: 'Business Information',
      fields: [
        {
          name: 'founded',
          type: 'date',
          label: 'Founded Date',
        },
        {
          name: 'industry',
          type: 'text',
          label: 'Industry',
        },
        {
          name: 'size',
          type: 'select',
          label: 'Company Size',
          options: [
            { label: '1-10 employees', value: '1-10' },
            { label: '11-50 employees', value: '11-50' },
            { label: '51-200 employees', value: '51-200' },
            { label: '201-500 employees', value: '201-500' },
            { label: '501-1000 employees', value: '501-1000' },
            { label: '1000+ employees', value: '1000+' },
          ],
        },
        {
          name: 'taxId',
          type: 'text',
          label: 'Tax ID/EIN',
          admin: {
            description: 'For internal use only',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Information',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Default Meta Title',
          admin: {
            description: 'Default title for SEO (can be overridden on individual pages)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Default Meta Description',
          admin: {
            description: 'Default description for SEO (can be overridden on individual pages)',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Default Keywords',
          admin: {
            description: 'Comma-separated keywords for SEO',
          },
        },
      ],
    },
  ],
}
