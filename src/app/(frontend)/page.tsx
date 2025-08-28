import React from 'react'
import './styles.css'
import Hero from '@/components/custom/hero'
import { getWebContent } from '@/functions/webContent.function'
import ExploreCategories from '@/components/custom/explore-categories'
import { getAllCategories } from '@/functions/category.function'
import FeaturedProducts from '@/components/custom/featured-products'
import TopSellers from '@/components/custom/top-sellers'

export default async function HomePage() {
  const { data: webContent } = await getWebContent()

  const { heroImage, featuredProducts, topSellerHero, topSellerProducts } = webContent || {}

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
      </div>
    </div>
  )
}
