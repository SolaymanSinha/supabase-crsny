import 'reflect-metadata'
import React from 'react'
import './styles.css'
import Nav from '@/components/custom/nav'
import { getCompany } from '@/functions/company.function'
import { Company } from '@/payload-types'
import { getFeaturedCategories } from '@/functions/category.function'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const { data: companyInfo } = await getCompany()
  const { data: featuredCategories } = await getFeaturedCategories()

  return (
    <html lang="en">
      <body>
        {companyInfo && featuredCategories && (
          <Nav companyInfo={companyInfo} categories={featuredCategories} />
        )}
        <main>{children}</main>
      </body>
    </html>
  )
}
