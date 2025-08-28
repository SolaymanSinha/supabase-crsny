import React from 'react'
import './styles.css'
import Hero from '@/components/custom/hero'
import { getWebContent } from '@/functions/webContent.function'
import ExploreCategories from '@/components/custom/explore-categories'
import { getAllCategories } from '@/functions/category.function'

export default async function HomePage() {
  const { data: webContent } = await getWebContent()
  const { heroImage } = webContent || {}

  const { data } = await getAllCategories()
  return (
    <div className="space-y-10">
      <Hero heroImage={heroImage} />
      <ExploreCategories categories={data || []} />
    </div>
  )
}
