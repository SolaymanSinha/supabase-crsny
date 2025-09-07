import { fallbackImageURL, getFullURL } from '@/lib/utils/url'
import { Product } from '@/payload-types'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import SectionHeading from './section-heading'
import Link from 'next/link'

export default async function TopSellers({
  products,
  imageURL,
}: {
  products: Product[]
  imageURL: string
}) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Main Heading */}
      <SectionHeading>Top Sellers</SectionHeading>

      {/* Hero Section */}
      <TopSellerHero imageURL={imageURL} />

      {/* Product Grid */}
      <TopSellingProducts products={products} />
    </div>
  )
}

const TopSellerHero = ({ imageURL }: { imageURL: string }) => {
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

const TopSellingProducts = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

const ProductCard = ({ product }: { product: Product }) => {
  const { slug } = product

  return (
    <Link href={`/products/${slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 p-0">
        <CardContent className="p-0">
          <div className="relative">
            {/* Product Image */}
            <div className="aspect-[4/3] bg-gray-200 rounded-t-lg overflow-hidden">
              {product.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <Image
                  src={
                    (typeof product?.coverImage === 'object' &&
                      getFullURL(product?.coverImage?.url)) ||
                    fallbackImageURL({ width: 400, height: 400 })
                  }
                  width={400}
                  height={400}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-[#ffc107] text-black font-semibold text-lg px-4 py-2 rounded-full hover:bg-[#ffc107]/90 transition-colors">
                {typeof product?.category === 'object' && product?.category?.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
