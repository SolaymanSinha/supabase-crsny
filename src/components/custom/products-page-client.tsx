'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import { Search, Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react'
import { ProductSearchParams, ProductSearchResult } from '@/repositories/product.repository'
import { Category, Company, Media, Product } from '@/payload-types'
import { getFullURL, fallbackImageURL } from '@/lib/utils/url'

interface ProductsPageClientProps {
  products: ProductSearchResult
  categories: Category[]
  companyInfo: Company
  initialSearchParams: ProductSearchParams
}

export default function ProductsPageClient({
  products,
  categories,
  companyInfo: _companyInfo,
  initialSearchParams,
}: ProductsPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for filters
  const [searchTerm, setSearchTerm] = useState(initialSearchParams.search || '')
  const [selectedCategory, setSelectedCategory] = useState(initialSearchParams.category || '')
  const [minPrice, setMinPrice] = useState(initialSearchParams.minPrice?.toString() || '')
  const [maxPrice, setMaxPrice] = useState(initialSearchParams.maxPrice?.toString() || '')
  const [sortBy, setSortBy] = useState(initialSearchParams.sort || '-createdAt')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Update URL with search params
  const updateSearchParams = (newParams: Partial<ProductSearchParams>) => {
    const params = new URLSearchParams(searchParams.toString())

    // Update or remove parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    // Always reset to page 1 when filters change (except when explicitly setting page)
    if (!newParams.page) {
      params.delete('page')
    }

    router.push(`/products?${params.toString()}`)
  }

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateSearchParams({
      search: searchTerm,
      category: selectedCategory,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      sort: sortBy,
    })
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setMinPrice('')
    setMaxPrice('')
    setSortBy('-createdAt')
    router.push('/products')
  }

  // Generate pagination items
  const generatePaginationItems = () => {
    const items = []
    const currentPage = products.page
    const totalPages = products.totalPages
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: i.toString() }).toString()}`}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    } else {
      // Show ellipsis for more than 7 pages
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: '1' }).toString()}`}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      )

      if (currentPage > 3) {
        items.push(<PaginationEllipsis key="ellipsis1" />)
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: i.toString() }).toString()}`}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationEllipsis key="ellipsis2" />)
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: totalPages.toString() }).toString()}`}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        )
      }
    }

    return items
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-yellow-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-orange-200/40 to-transparent rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-6">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Discover Our Products
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
              Explore our complete collection of high-quality products. Use our advanced search and
              filtering to find exactly what you need.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-20 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-yellow-500 shadow-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-2 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="relative pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <div className="hidden lg:flex items-center space-x-4">
                  {/* Category Filter */}
                  <Select
                    value={selectedCategory || 'all'}
                    onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Price Range */}
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Min Price"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-24"
                    />
                    <span className="text-gray-500">-</span>
                    <Input
                      type="number"
                      placeholder="Max Price"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-24"
                    />
                  </div>

                  <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Apply
                  </Button>

                  {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                    <Button variant="ghost" onClick={clearFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(value) => {
                    setSortBy(value)
                    updateSearchParams({ sort: value })
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-createdAt">Newest First</SelectItem>
                    <SelectItem value="createdAt">Oldest First</SelectItem>
                    <SelectItem value="title">Name A-Z</SelectItem>
                    <SelectItem value="-title">Name Z-A</SelectItem>
                    <SelectItem value="basePrice">Price Low to High</SelectItem>
                    <SelectItem value="-basePrice">Price High to Low</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-white rounded-2xl shadow-lg p-6 space-y-4">
                <Select
                  value={selectedCategory || 'all'}
                  onValueChange={(value) => setSelectedCategory(value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handleSearch}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Apply Filters
                  </Button>
                  {(searchTerm || selectedCategory || minPrice || maxPrice) && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6">
              <p className="text-gray-600">
                Showing {products.docs.length} of {products.totalDocs} products
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory &&
                  ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
              </p>
            </div>
          </div>

          {/* Products Grid/List */}
          {products.docs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all products.
              </p>
              <Button onClick={clearFilters} className="bg-yellow-500 hover:bg-yellow-600">
                View All Products
              </Button>
            </div>
          ) : (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'
                    : 'space-y-6 mb-12'
                }
              >
                {products.docs.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {products.totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      {products.hasPrevPage && (
                        <PaginationItem>
                          <PaginationPrevious
                            href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: products.prevPage!.toString() }).toString()}`}
                          />
                        </PaginationItem>
                      )}

                      {generatePaginationItems()}

                      {products.hasNextPage && (
                        <PaginationItem>
                          <PaginationNext
                            href={`/products?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: products.nextPage!.toString() }).toString()}`}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, viewMode }: { product: Product; viewMode: 'grid' | 'list' }) {
  const coverImage = product.coverImage as Media
  const category = product.category

  if (viewMode === 'list') {
    return (
      <Link href={`/products/${product.slug}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 h-48 overflow-hidden">
              <Image
                src={getFullURL(coverImage?.url) || fallbackImageURL({ width: 400, height: 300 })}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {category && (
                <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {typeof category === 'object' ? category.name : category}
                </div>
              )}
            </div>
            <div className="flex-1 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                {product.title}
              </h3>
              {product.shortDescription && (
                <p className="text-gray-600 mb-4 line-clamp-2">{product.shortDescription}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-yellow-600">
                  ${product.basePrice.toFixed(2)}
                </span>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getFullURL(coverImage?.url) || fallbackImageURL({ width: 400, height: 300 })}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {category && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {typeof category === 'object' ? category.name : category}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-1">
            {product.title}
          </h3>
          {product.shortDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.shortDescription}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-yellow-600">
              ${product.basePrice.toFixed(2)}
            </span>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
              View
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
