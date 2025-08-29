import { PRODUCT_SERVICE_TOKEN } from '@/lib/constants/di-tokens/product'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { AppError } from '@/lib/utils/errors'
import { Product } from '@/payload-types'
import type { IProductService } from '@/services/product.service'
import { inject, injectable } from 'tsyringe'

export interface IProductController {
  getBySlug(slug: string): Promise<ApiResponse<Product>>
}

@injectable()
export class ProductController implements IProductController {
  constructor(@inject(PRODUCT_SERVICE_TOKEN) private readonly productService: IProductService) {}

  async getBySlug(slug: string): Promise<ApiResponse<Product>> {
    try {
      const result = await this.productService.getBySlug(slug)
      return ApiResponseBuilder.success<Product>(result)
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }
}
