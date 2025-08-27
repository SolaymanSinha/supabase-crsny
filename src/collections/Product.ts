import { CollectionConfig } from 'payload'

export const Product: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'title', 'category', 'status', 'price', 'stock'],
    group: 'E-commerce',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'The main product title',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier for the product',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Detailed product description',
      },
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Brief product description for listings',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      admin: {
        description: 'Primary category for this product',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
      admin: {
        description: 'Primary image (Will be used as thumbnail)',
      },
    },

    {
      name: 'previewImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Additional images for product preview',
      },
    },
    {
      name: 'basePrice',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Base price for the product (before variants)',
      },
    },
    {
      name: 'variants',
      type: 'array',
      fields: [
        {
          name: 'variantName',
          type: 'relationship',
          relationTo: 'variant-names',
          hasMany: false,
          admin: {
            description: 'Select the variant name for this variant',
          },
        },
        {
          name: 'variantValue',
          type: 'relationship',
          relationTo: 'variant-values',
          hasMany: false,
          admin: {
            description: 'Select the variant value for this variant',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the product is active and visible to customers',
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        description: 'SEO settings for this product',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'SEO title (if different from product title)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'SEO meta description',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'SEO keywords (comma-separated)',
          },
        },
      ],
    },
    {
      name: 'uploadFields',
      type: 'array',
      admin: {
        description: 'Configure custom upload fields for customers to upload their images/designs',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Label for the upload field (e.g., "Upload Logo", "Upload Design")',
          },
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make this upload field required for customers',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Additional instructions for customers (e.g., "PNG, JPG up to 10MB")',
          },
        },
        {
          name: 'maxFiles',
          type: 'number',
          defaultValue: 1,
          min: 1,
          max: 10,
          admin: {
            description: 'Maximum number of files allowed for this field',
          },
        },
      ],
    },
  ],
}
