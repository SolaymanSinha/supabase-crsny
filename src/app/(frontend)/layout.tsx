import 'reflect-metadata'

import React from 'react'
import './styles.css'
import Nav from '@/components/custom/nav'
import { getCompany } from '@/functions/company.function'
import { Company } from '@/payload-types'
import { getFeaturedCategories } from '@/functions/category.function'
import Footer from '@/components/custom/footer'
import { getWebContent } from '@/functions/webContent.function'
import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { headers } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const company = await getCompany()
    const headersList = await headers()
    const pathname = headersList.get('x-invoke-path') || '/'

    // Split the pathname by '/', filter out empty segments, and get the last one.
    const segments = pathname.split('/').filter(Boolean)
    const lastPathnameSegment = segments.pop() || 'Home' // Default to 'home' for the root path
    return generateSEOMetadata(
      {
        title: lastPathnameSegment,
        description: 'We are here to make your printing easier',
        noIndex: true,
      },
      company.data,
    )
  } catch (error) {
    console.error('Error generating Root Layout metadata:', error)
    return {
      description: 'Store',
      title: 'we are here to make your printing works easier',
    }
  }
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const { data: companyInfo } = await getCompany()
  const { data: featuredCategories } = await getFeaturedCategories()
  const { data: webContent } = await getWebContent()

  return (
    <html lang="en">
      <body>
        {companyInfo && featuredCategories && (
          <Nav companyInfo={companyInfo} categories={featuredCategories} />
        )}
        <main>{children}</main>
        <Footer
          footerContent={webContent?.footerContent && webContent.footerContent}
          companyInfo={companyInfo || ({} as Company)}
        />
      </body>
    </html>
  )
}
