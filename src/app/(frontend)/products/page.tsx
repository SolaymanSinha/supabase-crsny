import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { searchProducts } from '@/functions/product.function'
import { getCompany } from '@/functions/company.function'
import { getAllCategories } from '@/functions/category.function'
import { ProductSearchParams } from '@/repositories/product.repository'
import { generateProductsListingSEO } from '@/lib/utils/seo'
import ProductsPageClient from '@/components/custom/products-page-client'

interface SearchParams {
  search?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  page?: string
  limit?: string
  sort?: string
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams

  try {
    const companyResponse = await getCompany()

    // Transform search params for SEO function
    const seoSearchParams = {
      search: resolvedSearchParams.search,
      category: resolvedSearchParams.category,
    }

    return generateProductsListingSEO(seoSearchParams, companyResponse.data || undefined)
  } catch (error) {
    console.error('Error generating products metadata:', error)
    return {
      title: 'Products',
      description: 'Browse our complete collection of high-quality products.',
    }
  }
}

// Loading component for Suspense
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse space-y-8">
          <div className="text-center space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl w-64 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto"></div>
          </div>

          {/* Filters skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Await searchParams before using its properties
  const resolvedSearchParams = await searchParams

  // Parse search params
  const searchParamsForAPI: ProductSearchParams = {
    search: resolvedSearchParams.search || undefined,
    category: resolvedSearchParams.category || undefined,
    minPrice: resolvedSearchParams.minPrice ? parseFloat(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? parseFloat(resolvedSearchParams.maxPrice) : undefined,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page, 10) : 1,
    limit: resolvedSearchParams.limit ? parseInt(resolvedSearchParams.limit, 10) : 12,
    sort: resolvedSearchParams.sort || '-createdAt',
  }

  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent searchParams={searchParamsForAPI} />
    </Suspense>
  )
}

async function ProductsContent({ searchParams }: { searchParams: ProductSearchParams }) {
  try {
    // Fetch data in parallel
    const [productsResponse, categoriesResponse, companyResponse] = await Promise.all([
      searchProducts(searchParams),
      getAllCategories(),
      getCompany(),
    ])

    if (!productsResponse.success) {
      throw new Error(productsResponse.message || 'Failed to load products')
    }

    if (!categoriesResponse.success) {
      throw new Error(categoriesResponse.message || 'Failed to load categories')
    }

    if (!companyResponse.success) {
      throw new Error(companyResponse.message || 'Failed to load company info')
    }

    return (
      <ProductsPageClient
        products={productsResponse.data!}
        categories={categoriesResponse.data || []}
        companyInfo={companyResponse.data!}
        initialSearchParams={searchParams}
      />
    )
  } catch (error) {
    console.error('Products page error:', error)

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We're having trouble loading the products. Please try again later or contact support
              if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }
}
