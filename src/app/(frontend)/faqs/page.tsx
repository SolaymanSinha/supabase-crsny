import { getFaqs } from '@/functions/pages.function'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateMetadata(): Promise<Metadata> {
  const response = await getFaqs()

  if (!response.success || !response.data) {
    return {
      title: 'FAQs',
      description: 'Frequently asked questions and answers.',
    }
  }

  const faqs = response.data

  return {
    title: faqs.seo?.metaTitle || faqs.title || 'FAQs',
    description: faqs.seo?.metaDescription || 'Frequently asked questions and answers.',
  }
}

export default async function FAQsPage() {
  const response = await getFaqs()

  if (!response.success || !response.data) {
    notFound()
  }

  const faqs = response.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/40 to-transparent rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-purple-600 rounded-2xl mb-6">
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
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {faqs.title}
            </h1>
            {faqs.subtitle && (
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                {faqs.subtitle}
              </p>
            )}
            {faqs.description && (
              <div className="prose prose-lg lg:prose-xl text-gray-700 max-w-none mx-auto prose-headings:text-gray-900 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-700">
                <RichText data={faqs.description} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      {faqs.categories && faqs.categories.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {faqs.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-16 lg:mb-20">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl mb-4">
                      <span className="text-yellow-500 font-bold text-lg">{categoryIndex + 1}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                      {category.categoryName}
                    </h2>
                    {category.categoryDescription && (
                      <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {category.categoryDescription}
                      </p>
                    )}
                  </div>

                  {category.questions && category.questions.length > 0 && (
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((faq, questionIndex) => (
                          <AccordionItem
                            key={questionIndex}
                            value={`${categoryIndex}-${questionIndex}`}
                            className="border-0 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                          >
                            <AccordionTrigger className="text-left px-6 sm:px-8 py-6 hover:bg-white/50 transition-colors [&[data-state=open]]:bg-white/70">
                              <div className="flex items-start gap-4 w-full">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-yellow-500 to-purple-600 rounded-xl flex items-center justify-center mt-1">
                                  <span className="text-white font-bold text-sm">
                                    {questionIndex + 1}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-3 mb-2">
                                    {faq.featured && (
                                      <span className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        ⭐ Featured
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-purple-500 transition-colors leading-relaxed">
                                    {faq.question}
                                  </h3>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 sm:px-8 pb-6">
                              <div className="ml-12 prose prose-lg text-gray-700 max-w-none prose-headings:text-gray-900 prose-a:text-purple-600 prose-a:no-underline hover:prose-a:text-purple-700">
                                <RichText data={faq.answer} />
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                    </Accordion>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA Section */}
      {faqs.contactCTA?.enabled && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.1),_transparent_50%)]" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-purple-600 rounded-2xl mb-6">
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
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {faqs.contactCTA.title}
              </h2>
              {faqs.contactCTA.description && (
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 leading-relaxed">
                  {faqs.contactCTA.description}
                </p>
              )}
              {faqs.contactCTA.buttonLink && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-purple-600 hover:from-yellow-600 hover:to-purple-700 text-white border-0 px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <Link href={faqs.contactCTA.buttonLink}>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      {faqs.contactCTA.buttonText || 'Contact Support'}
                    </Link>
                  </Button>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Response within 24 hours
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Still Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for? Try searching our{' '}
                <Link
                  href="/help"
                  className="text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
                >
                  help center
                </Link>{' '}
                or{' '}
                <Link
                  href="/contact"
                  className="text-yellow-500 hover:text-yellow-600 font-semibold transition-colors"
                >
                  contact us directly
                </Link>
                .
              </p>
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  24/7 Support
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Quick Response
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
