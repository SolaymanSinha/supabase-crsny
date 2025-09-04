import ProductDetails from '@/components/custom/product-details'
import { getProductBySlug } from '@/functions/product.function'
import { notFound } from 'next/navigation'
import React from 'react'

const ProductDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const { data: product } = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return (
    <div>
      <ProductDetails product={product} />
    </div>
  )
}

export default ProductDetailsPage
