import 'reflect-metadata'

import React from 'react'
import './styles.css'
import Nav from '@/components/custom/nav'
import { getCompany } from '@/functions/company.function'
import { Company } from '@/payload-types'
import { getFeaturedCategories } from '@/functions/category.function'
import Footer from '@/components/custom/footer'
import { getWebContent } from '@/functions/webContent.function'

export const metadata = {
  title: 'Store',
  description: 'we are here to make your printing works easier',
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
