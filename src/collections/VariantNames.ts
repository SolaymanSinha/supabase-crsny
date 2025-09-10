import { CollectionConfig } from 'payload'

export const VariantNames: CollectionConfig = {
  slug: 'variant-names',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['id', 'name'],
    group: 'E-commerce',
    hidden: true
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      validate: (value: string | null | undefined) => {
        // Simple validation without database queries to avoid circular issues
        if (!value) {
          return 'Name is required'
        }

        if (value.length < 2) {
          return 'Name must be at least 2 characters long'
        }

        return true
      },
    },
  ],
}
