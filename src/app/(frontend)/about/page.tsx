import { getAboutUs } from '@/functions/pages.function'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/payload-types'
import { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'

export async function generateMetadata(): Promise<Metadata> {
  const response = await getAboutUs()

  if (!response.success || !response.data) {
    return {
      title: 'About Us',
      description: 'Learn more about our company and team.',
    }
  }

  const aboutUs = response.data

  return {
    title: aboutUs.seo?.metaTitle || aboutUs.title || 'About Us',
    description: aboutUs.seo?.metaDescription || 'Learn more about our company and team.',
  }
}

export default async function AboutPage() {
  const response = await getAboutUs()

  if (!response.success || !response.data) {
    notFound()
  }

  const aboutUs = response.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                  {aboutUs.title}
                </h1>
                {aboutUs.subtitle && (
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed">
                    {aboutUs.subtitle}
                  </p>
                )}
              </div>
              {aboutUs.content && (
                <div className="prose prose-lg lg:prose-xl text-gray-700 max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700">
                  <RichText data={aboutUs.content} />
                </div>
              )}
            </div>
            {aboutUs.heroImage && (
              <div className="relative order-first lg:order-last">
                <div className="relative h-64 sm:h-80 lg:h-[500px] xl:h-[600px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                  <Image
                    src={(aboutUs.heroImage as Media).url || ''}
                    alt={(aboutUs.heroImage as Media).alt || aboutUs.title || 'About Us'}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    priority
                  />
                </div>
                {/* Floating decoration */}
                {/* <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full opacity-20 blur-xl" /> */}
                {/* <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-full opacity-20 blur-xl" /> */}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {aboutUs.sections && aboutUs.sections.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-20 lg:space-y-32">
              {aboutUs.sections.map((section, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-1 bg-gradient-to-r from-yellow-500 to-purple-600 rounded-full"></div>
                        <span className="text-sm font-semibold text-yellow-500 uppercase tracking-wider">
                          Section {index + 1}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                        {section.sectionTitle}
                      </h2>
                    </div>
                    <div className="prose prose-lg lg:prose-xl text-gray-700 max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700">
                      <RichText data={section.sectionContent} />
                    </div>
                  </div>
                  {section.sectionImage && (
                    <div
                      className={`relative ${
                        index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''
                      }`}
                    >
                      <div className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 group">
                        <Image
                          src={(section.sectionImage as Media).url || ''}
                          alt={(section.sectionImage as Media).alt || section.sectionTitle}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {/* Floating badge */}
                      <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {aboutUs.team && aboutUs.team.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(120,119,198,0.1),_transparent_50%)]" />

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                Meet Our Team
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The passionate people behind our success
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {aboutUs.team.map((member, index) => (
                <div key={index} className="group">
                  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
                    {member.image && (
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-6">
                        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl ring-4 ring-white">
                          <Image
                            src={(member.image as Media).url || ''}
                            alt={member.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                      </div>
                    )}

                    <div className="text-center space-y-3">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{member.name}</h3>
                      <p className="text-sm lg:text-base font-semibold text-yellow-500 bg-blue-50 px-3 py-1 rounded-full inline-block">
                        {member.position}
                      </p>
                      {member.bio && (
                        <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                          {member.bio}
                        </p>
                      )}

                      {member.socialLinks && (
                        <div className="flex justify-center space-x-4 pt-4">
                          {member.socialLinks.linkedin && (
                            <Link
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-gray-100 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors duration-300 group/social"
                            >
                              <svg
                                className="w-5 h-5 text-gray-600 group-hover/social:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </Link>
                          )}
                          {member.socialLinks.twitter && (
                            <Link
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-gray-100 hover:bg-blue-400 rounded-xl flex items-center justify-center transition-colors duration-300 group/social"
                            >
                              <svg
                                className="w-5 h-5 text-gray-600 group-hover/social:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </Link>
                          )}
                          {member.socialLinks.email && (
                            <Link
                              href={`mailto:${member.socialLinks.email}`}
                              className="w-10 h-10 bg-gray-100 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-colors duration-300 group/social"
                            >
                              <svg
                                className="w-5 h-5 text-gray-600 group-hover/social:text-white"
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
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
