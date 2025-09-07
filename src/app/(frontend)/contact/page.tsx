import { getContactUs } from '@/functions/pages.function'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ContactForm from '@/components/forms/contact-form'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateMetadata(): Promise<Metadata> {
  const response = await getContactUs()

  if (!response.success || !response.data) {
    return {
      title: 'Contact Us',
      description: 'Get in touch with our team.',
    }
  }

  const contactUs = response.data

  return {
    title: contactUs.seo?.metaTitle || contactUs.title || 'Contact Us',
    description: contactUs.seo?.metaDescription || 'Get in touch with our team.',
  }
}

export default async function ContactPage() {
  const response = await getContactUs()

  if (!response.success || !response.data) {
    notFound()
  }

  const contactUs = response.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30" />
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-200/40 to-transparent rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-green-600 rounded-2xl mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {contactUs.title}
            </h1>
            {contactUs.subtitle && (
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                {contactUs.subtitle}
              </p>
            )}
            {contactUs.description && (
              <div className="prose prose-lg lg:prose-xl text-gray-700 max-w-none mx-auto prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700">
                <RichText data={contactUs.description} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-green-600 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                    Contact Info
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We'd love to hear from you. Send us a message and we'll respond as soon as
                  possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactUs.contactInfo?.address && (
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">Our Location</h3>
                        <div className="text-gray-600 space-y-1">
                          {contactUs.contactInfo.address.street && (
                            <p className="font-medium">{contactUs.contactInfo.address.street}</p>
                          )}
                          <p>
                            {[
                              contactUs.contactInfo.address.city,
                              contactUs.contactInfo.address.state,
                              contactUs.contactInfo.address.postalCode,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {contactUs.contactInfo.address.country && (
                            <p className="font-medium">{contactUs.contactInfo.address.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {contactUs.contactInfo?.phone && (
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">Call Us</h3>
                        <a
                          href={`tel:${contactUs.contactInfo.phone}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors font-semibold text-lg"
                        >
                          {contactUs.contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {contactUs.contactInfo?.email && (
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">Email Us</h3>
                        <a
                          href={`mailto:${contactUs.contactInfo.email}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors font-semibold text-lg"
                        >
                          {contactUs.contactInfo.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Business Hours */}
              {contactUs.contactInfo?.businessHours &&
                contactUs.contactInfo.businessHours.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-6 text-lg flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Business Hours
                    </h3>
                    <div className="space-y-3">
                      {contactUs.contactInfo.businessHours.map((hours, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                        >
                          <span className="text-gray-700 font-medium capitalize">{hours.day}</span>
                          <span
                            className={`font-semibold ${hours.closed ? 'text-red-600' : 'text-green-600'}`}
                          >
                            {hours.closed ? 'Closed' : hours.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Contact Form */}
            {contactUs.contactForm?.enabled && (
              <div className="bg-white rounded-3xl shadow-2xl ring-1 ring-black/5 p-8 lg:p-10">
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"></div>
                    <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">
                      Contact Form
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                    {contactUs.contactForm.formTitle || 'Send us a Message'}
                  </h2>
                  {contactUs.contactForm.formDescription && (
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {contactUs.contactForm.formDescription}
                    </p>
                  )}
                </div>
                <ContactForm
                  recipientEmail={contactUs.contactForm.recipientEmail}
                  successMessage={contactUs.contactForm.successMessage || undefined}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      {contactUs.map?.enabled && contactUs.map.embedUrl && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(120,119,198,0.1),_transparent_50%)]" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Find Us Here
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Visit our office for a face-to-face conversation. We're always happy to welcome you.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10 h-96 lg:h-[500px]">
              <iframe
                src={contactUs.map.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Location"
                className="hover:contrast-110 transition-all duration-300"
              />
              {/* Floating address card */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20 max-w-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Our Office</h3>
                    {contactUs.contactInfo?.address && (
                      <div className="text-xs text-gray-600 mt-1">
                        {contactUs.contactInfo.address.street && (
                          <p>{contactUs.contactInfo.address.street}</p>
                        )}
                        <p>
                          {[contactUs.contactInfo.address.city, contactUs.contactInfo.address.state]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
