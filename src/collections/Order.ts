import { CollectionConfig } from 'payload'

export const Order: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'status', 'totalAmount', 'createdAt'],
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
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique order number',
        readOnly: true,
      },
    },
    {
      name: 'cartSessionId',
      type: 'text',
      admin: {
        description: 'Session ID of the cart that was converted to this order',
      },
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: {
            description: 'Reference to the product',
          },
        },
        {
          name: 'selectedVariant',
          type: 'array',
          fields: [
            {
              name: 'variantName',
              type: 'text',
              required: true,
            },
            {
              name: 'variantValue',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Selected variant options for this product',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price at the time of order',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Quantity of this item ordered',
          },
        },
        {
          name: 'uploadedFiles',
          type: 'array',
          fields: [
            {
              name: 'fieldLabel',
              type: 'text',
              required: true,
              admin: {
                description: 'Label of the upload field',
              },
            },
            {
              name: 'files',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              admin: {
                description: 'Files uploaded by the customer',
              },
            },
          ],
          admin: {
            description: 'Custom files uploaded by the customer for this item',
          },
        },
      ],
      admin: {
        description: 'Items in the order',
      },
    },
    {
      name: 'totalItems',
      type: 'number',
      required: true,
      admin: {
        description: 'Total number of items in the order',
      },
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Total amount of the order',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Current status of the order',
      },
    },
    {
      name: 'customerInfo',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Customer full name',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            description: 'Customer email address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Customer phone number',
          },
        },
      ],
      admin: {
        description: 'Customer information',
      },
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
          admin: {
            description: 'Street address',
          },
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          admin: {
            description: 'City',
          },
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          admin: {
            description: 'State/Province',
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
          admin: {
            description: 'Postal/ZIP code',
          },
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          admin: {
            description: 'Country',
          },
        },
      ],
      admin: {
        description: 'Shipping address',
      },
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Use shipping address for billing',
          },
        },
        {
          name: 'street',
          type: 'text',
          admin: {
            description: 'Street address',
            condition: (data) => !data?.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'City',
            condition: (data) => !data?.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State/Province',
            condition: (data) => !data?.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'postalCode',
          type: 'text',
          admin: {
            description: 'Postal/ZIP code',
            condition: (data) => !data?.billingAddress?.sameAsShipping,
          },
        },
        {
          name: 'country',
          type: 'text',
          admin: {
            description: 'Country',
            condition: (data) => !data?.billingAddress?.sameAsShipping,
          },
        },
      ],
      admin: {
        description: 'Billing address',
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
      admin: {
        description: 'Payment status',
      },
    },
    {
      name: 'paymentIntentId',
      type: 'text',
      admin: {
        description: 'Stripe Payment Intent ID',
        readOnly: true,
      },
    },
    {
      name: 'paymentEmail',
      type: 'email',
      admin: {
        description: 'Email used for payment',
      },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: {
        description: 'Stripe Customer ID',
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'text',
      admin: {
        description: 'Payment method used (e.g., card_1234...)',
        readOnly: true,
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        description: 'Date and time when payment was completed',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the order',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Generate order number for new orders
        if (operation === 'create' && !data.orderNumber) {
          const timestamp = Date.now()
          const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0')
          data.orderNumber = `ORD-${timestamp}-${random}`
        }
        return data
      },
    ],
  },
}
