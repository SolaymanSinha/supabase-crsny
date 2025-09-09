import ProductDetails from '@/components/custom/product-details'
import { getProductBySlug } from '@/functions/product.function'
import { getCompany } from '@/functions/company.function'
import { generateProductSEO } from '@/lib/utils/seo'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import React from 'react'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    // Fetch product and company data in parallel
    const [productResponse, companyResponse] = await Promise.all([
      getProductBySlug(slug),
      getCompany(),
    ])

    if (!productResponse.success || !productResponse.data) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      }
    }

    return generateProductSEO(productResponse.data, companyResponse.data || undefined)
  } catch (error) {
    console.error('Error generating product metadata:', error)
    return {
      title: 'Product',
      description: 'Product details page',
    }
  }
}

const ProductDetailsPage = async ({ params }: ProductPageProps) => {
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
