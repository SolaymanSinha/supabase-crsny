import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Product } from '@/payload-types'
import Image from 'next/image'
import { fallbackImageURL, getFullURL } from '@/lib/utils/url'
import SectionHeading from './section-heading'
import Link from 'next/link'

const FeaturedProducts = ({ products }: { products: Product[] }) => {
  return (
    <>
      <SectionHeading className="text-left">Featured Products</SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}

const ProductCard = ({ product }: { product: Product }) => {
  if (!product) return
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
                    fallbackImageURL({})
                  }
                  alt={product.title}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Category Badge */}
            <div className="w-full">
              <Badge className="bg-[#ffc107] w-full text-black font-semibold text-lg px-4 py-2 rounded-none hover:bg-[#ffc107]/90 transition-colors">
                {typeof product?.category === 'object' && product?.category?.name}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default FeaturedProducts
