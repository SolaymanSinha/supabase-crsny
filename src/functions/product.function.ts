'use server'
import { ProductController } from '@/controllers/product.controller'
import { PRODUCT_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/product'
import { ApiResponse } from '@/lib/utils/api-response'
import { container } from '@/lib/utils/di-container'
import { Product } from '@/payload-types'
import type { ProductSearchParams, ProductSearchResult } from '@/repositories/product.repository'

const productController = container.resolve<ProductController>(PRODUCT_CONTROLLER_TOKEN)

export async function getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  const result = productController.getBySlug(slug)
  return result
}

export async function searchProducts(
  params: ProductSearchParams,
): Promise<ApiResponse<ProductSearchResult>> {
  const result = productController.search(params)
  return result
}
