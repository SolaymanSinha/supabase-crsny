import type { GlobalConfig } from 'payload'

export const Pages: GlobalConfig = {
  slug: 'pages',
  label: 'Pages',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'About Us',
          fields: [
            {
              name: 'aboutUs',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable About Us Page',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Page Title',
                  defaultValue: 'About Us',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  required: false,
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Hero Image',
                  required: false,
                },
                {
                  name: 'content',
                  type: 'richText',
                  label: 'Main Content',
                  required: true,
                },
                {
                  name: 'sections',
                  type: 'array',
                  label: 'Content Sections',
                  fields: [
                    {
                      name: 'sectionTitle',
                      type: 'text',
                      label: 'Section Title',
                      required: true,
                    },
                    {
                      name: 'sectionContent',
                      type: 'richText',
                      label: 'Section Content',
                      required: true,
                    },
                    {
                      name: 'sectionImage',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Section Image',
                      required: false,
                    },
                  ],
                },
                {
                  name: 'team',
                  type: 'array',
                  label: 'Team Members',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      label: 'Name',
                      required: true,
                    },
                    {
                      name: 'position',
                      type: 'text',
                      label: 'Position',
                      required: true,
                    },
                    {
                      name: 'bio',
                      type: 'textarea',
                      label: 'Bio',
                      required: false,
                    },
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Profile Image',
                      required: false,
                    },
                    {
                      name: 'socialLinks',
                      type: 'group',
                      label: 'Social Links',
                      fields: [
                        {
                          name: 'linkedin',
                          type: 'text',
                          label: 'LinkedIn URL',
                        },
                        {
                          name: 'twitter',
                          type: 'text',
                          label: 'Twitter URL',
                        },
                        {
                          name: 'email',
                          type: 'email',
                          label: 'Email',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'seo',
                  type: 'group',
                  label: 'SEO',
                  fields: [
                    {
                      name: 'metaTitle',
                      type: 'text',
                      label: 'Meta Title',
                    },
                    {
                      name: 'metaDescription',
                      type: 'textarea',
                      label: 'Meta Description',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact Us',
          fields: [
            {
              name: 'contactUs',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable Contact Us Page',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Page Title',
                  defaultValue: 'Contact Us',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  required: false,
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Page Description',
                  required: false,
                },
                {
                  name: 'contactInfo',
                  type: 'group',
                  label: 'Contact Information',
                  fields: [
                    {
                      name: 'address',
                      type: 'group',
                      label: 'Address',
                      fields: [
                        {
                          name: 'street',
                          type: 'text',
                          label: 'Street Address',
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
                          name: 'postalCode',
                          type: 'text',
                          label: 'Postal Code',
                        },
                        {
                          name: 'country',
                          type: 'text',
                          label: 'Country',
                        },
                      ],
                    },
                    {
                      name: 'phone',
                      type: 'text',
                      label: 'Phone Number',
                    },
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email Address',
                    },
                    {
                      name: 'businessHours',
                      type: 'array',
                      label: 'Business Hours',
                      fields: [
                        {
                          name: 'day',
                          type: 'select',
                          label: 'Day',
                          options: [
                            { label: 'Monday', value: 'monday' },
                            { label: 'Tuesday', value: 'tuesday' },
                            { label: 'Wednesday', value: 'wednesday' },
                            { label: 'Thursday', value: 'thursday' },
                            { label: 'Friday', value: 'friday' },
                            { label: 'Saturday', value: 'saturday' },
                            { label: 'Sunday', value: 'sunday' },
                          ],
                          required: true,
                        },
                        {
                          name: 'hours',
                          type: 'text',
                          label: 'Hours (e.g., 9:00 AM - 5:00 PM)',
                          required: true,
                        },
                        {
                          name: 'closed',
                          type: 'checkbox',
                          label: 'Closed',
                          defaultValue: false,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'contactForm',
                  type: 'group',
                  label: 'Contact Form Settings',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Enable Contact Form',
                      defaultValue: true,
                    },
                    {
                      name: 'formTitle',
                      type: 'text',
                      label: 'Form Title',
                      defaultValue: 'Get in Touch',
                    },
                    {
                      name: 'formDescription',
                      type: 'textarea',
                      label: 'Form Description',
                    },
                    {
                      name: 'recipientEmail',
                      type: 'email',
                      label: 'Recipient Email',
                      required: true,
                    },
                    {
                      name: 'successMessage',
                      type: 'textarea',
                      label: 'Success Message',
                      defaultValue: 'Thank you for your message. We will get back to you soon!',
                    },
                  ],
                },
                {
                  name: 'map',
                  type: 'group',
                  label: 'Map Settings',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Show Map',
                      defaultValue: false,
                    },
                    {
                      name: 'embedUrl',
                      type: 'textarea',
                      label: 'Google Maps Embed URL',
                    },
                  ],
                },
                {
                  name: 'seo',
                  type: 'group',
                  label: 'SEO',
                  fields: [
                    {
                      name: 'metaTitle',
                      type: 'text',
                      label: 'Meta Title',
                    },
                    {
                      name: 'metaDescription',
                      type: 'textarea',
                      label: 'Meta Description',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'FAQs',
          fields: [
            {
              name: 'faqs',
              type: 'group',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enable FAQs Page',
                  defaultValue: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Page Title',
                  defaultValue: 'Frequently Asked Questions',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  required: false,
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Page Description',
                  required: false,
                },
                {
                  name: 'categories',
                  type: 'array',
                  label: 'FAQ Categories',
                  fields: [
                    {
                      name: 'categoryName',
                      type: 'text',
                      label: 'Category Name',
                      required: true,
                    },
                    {
                      name: 'categoryDescription',
                      type: 'textarea',
                      label: 'Category Description',
                    },
                    {
                      name: 'questions',
                      type: 'array',
                      label: 'Questions',
                      fields: [
                        {
                          name: 'question',
                          type: 'text',
                          label: 'Question',
                          required: true,
                        },
                        {
                          name: 'answer',
                          type: 'richText',
                          label: 'Answer',
                          required: true,
                        },
                        {
                          name: 'featured',
                          type: 'checkbox',
                          label: 'Featured Question',
                          defaultValue: false,
                        },
                        {
                          name: 'order',
                          type: 'number',
                          label: 'Display Order',
                          defaultValue: 0,
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'contactCTA',
                  type: 'group',
                  label: 'Contact Call-to-Action',
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      label: 'Show Contact CTA',
                      defaultValue: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      label: 'CTA Title',
                      defaultValue: "Didn't find what you're looking for?",
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      label: 'CTA Description',
                      defaultValue: 'Contact our support team for personalized assistance.',
                    },
                    {
                      name: 'buttonText',
                      type: 'text',
                      label: 'Button Text',
                      defaultValue: 'Contact Support',
                    },
                    {
                      name: 'buttonLink',
                      type: 'text',
                      label: 'Button Link',
                      defaultValue: '/contact',
                    },
                  ],
                },
                {
                  name: 'seo',
                  type: 'group',
                  label: 'SEO',
                  fields: [
                    {
                      name: 'metaTitle',
                      type: 'text',
                      label: 'Meta Title',
                    },
                    {
                      name: 'metaDescription',
                      type: 'textarea',
                      label: 'Meta Description',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
