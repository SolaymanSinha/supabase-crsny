import { Product } from '@/payload-types'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import Image from 'next/image'
import { fallbackImageURL, getFullURL } from '@/lib/utils/url'
import SectionHeading from './section-heading'
import Link from 'next/link'

export const BestDeals = ({ imageURL, products }: { imageURL: string; products: Product[] }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Main Heading */}
      <SectionHeading>Best Deals</SectionHeading>

      {/* Hero Section */}
      <BestDealsHero imageURL={imageURL} />

      {/* Deals Grid */}
      <BestDealsProducts products={products} />
    </div>
  )
}

const DealCard = ({ deal }: { deal: Product }) => {
  const { coverImage, category, slug } = deal
  return (
    <Link href={`/products/${slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
        <CardContent className="p-0">
          <div className="relative">
            {/* Product Image */}
            <div className="aspect-[4/3] bg-gray-200 rounded-t-lg overflow-hidden">
              {typeof coverImage === 'object' && coverImage && (
                <div className="relative w-full h-full">
                  <Image
                    src={(coverImage?.url && getFullURL(coverImage?.url)) || fallbackImageURL({})}
                    alt={coverImage?.alt || 'Deal'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>

            {/* Centered Category Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#ffc107] text-black font-semibold text-lg px-4 py-2 rounded-full hover:bg-[#ffc107]/90 transition-colors">
                {typeof category === 'object' && category && category?.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

const BestDealsHero = ({ imageURL }: { imageURL: string }) => {
  return (
    <div className="relative rounded-lg overflow-hidden mb-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image
        src={getFullURL(imageURL) || fallbackImageURL({ width: 1280, height: 720 })}
        width={1280}
        height={720}
        alt="Top Sellers"
        className="w-full h-auto object-cover aspect-video"
      />
    </div>
  )
}

const BestDealsProducts = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <DealCard key={product.id} deal={product} />
      ))}
    </div>
  )
}
