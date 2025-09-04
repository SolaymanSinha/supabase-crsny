'use server'
import { ProductController } from '@/controllers/product.controller'
import { PRODUCT_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/product'
import { ApiResponse } from '@/lib/utils/api-response'
import { container } from '@/lib/utils/di-container'
import { Product } from '@/payload-types'

const productController = container.resolve<ProductController>(PRODUCT_CONTROLLER_TOKEN)

export async function getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
  const result = productController.getBySlug(slug)
  return result
}
