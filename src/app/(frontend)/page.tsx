import React from 'react'
import { Metadata } from 'next'
import './styles.css'
import Hero from '@/components/custom/hero'
import { getWebContent } from '@/functions/webContent.function'
import { getCompany } from '@/functions/company.function'
import { generateHomeSEO } from '@/lib/utils/seo'
import ExploreCategories from '@/components/custom/explore-categories'
import { getAllCategories } from '@/functions/category.function'
import FeaturedProducts from '@/components/custom/featured-products'
import TopSellers from '@/components/custom/top-sellers'
import { PartnerLogos } from '@/components/custom/partner-logos'
import { BestDeals } from '@/components/custom/best-deals'
import KeyFeatures from '@/components/custom/key-features'
import Newsletter from '@/components/custom/newsletter'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const companyResponse = await getCompany()
    return generateHomeSEO(companyResponse.data || undefined)
  } catch (error) {
    console.error('Error generating home page metadata:', error)
    return {
      title: 'Welcome',
      description: 'Discover our premium products and exceptional service.',
    }
  }
}

export default async function HomePage() {
  const { data: webContent } = await getWebContent()

  const {
    heroImage,
    featuredProducts,
    topSellerHero,
    topSellerProducts,
    partnerLogos,
    bestDealsHero,
    bestDealsProducts,
  } = webContent || {}

  const { data } = await getAllCategories()
  return (
    <div className="space-y-10">
      <Hero heroImage={heroImage} />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-20">
        <ExploreCategories categories={data || []} />
        <FeaturedProducts
          products={
            featuredProducts && featuredProducts.every((product) => typeof product === 'object')
              ? featuredProducts
              : []
          }
        />
        <TopSellers
          products={
            (topSellerProducts &&
              topSellerProducts.every((product) => typeof product === 'object') &&
              topSellerProducts) ||
            []
          }
          imageURL={
            (typeof topSellerHero === 'object' &&
              typeof topSellerHero?.url === 'string' &&
              topSellerHero?.url) ||
            ''
          }
        />

        <PartnerLogos
          images={
            (partnerLogos &&
              partnerLogos.every((logo) => typeof logo === 'object') &&
              partnerLogos) ||
            []
          }
        />
        <BestDeals
          imageURL={
            (typeof bestDealsHero === 'object' &&
              typeof bestDealsHero?.url === 'string' &&
              bestDealsHero?.url) ||
            ''
          }
          products={
            (bestDealsProducts &&
              bestDealsProducts.every((product) => typeof product === 'object') &&
              bestDealsProducts) ||
            []
          }
        />

        <KeyFeatures />
        <Newsletter />
      </div>
    </div>
  )
}
