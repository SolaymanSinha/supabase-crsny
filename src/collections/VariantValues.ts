import { CollectionConfig } from 'payload'

export const VariantValues: CollectionConfig = {
  slug: 'variant-values',
  admin: {
    useAsTitle: 'value',
    defaultColumns: ['value'],
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
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: string | null | undefined) => {
        // Simple validation without database queries to avoid circular issues
        if (!value) {
          return 'Value is required'
        }

        if (value.length < 1) {
          return 'Value must be at least 1 character long'
        }

        return true
      },
    },
  ],
}
