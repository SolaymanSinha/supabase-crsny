import React from 'react'
import './styles.css'
import Hero from '@/components/custom/hero'
import { getWebContent } from '@/functions/webContent.function'

export default async function HomePage() {
  const { data: webContent } = await getWebContent()
  const { heroImage } = webContent || {}
  return (
    <div>
      <Hero heroImage={heroImage} />
    </div>
  )
}
