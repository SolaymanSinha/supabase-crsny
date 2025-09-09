import { PRODUCT_SERVICE_TOKEN } from '@/lib/constants/di-tokens/product'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { AppError } from '@/lib/utils/errors'
import { Product } from '@/payload-types'
import type { IProductService } from '@/services/product.service'
import type { ProductSearchParams, ProductSearchResult } from '@/repositories/product.repository'
import { inject, injectable } from 'tsyringe'

export interface IProductController {
  getBySlug(slug: string): Promise<ApiResponse<Product>>
  search(params: ProductSearchParams): Promise<ApiResponse<ProductSearchResult>>
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

  async search(params: ProductSearchParams): Promise<ApiResponse<ProductSearchResult>> {
    try {
      const result = await this.productService.search(params)

      // Extract pagination metadata for the meta field
      const meta = {
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalDocs: result.totalDocs,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevPage: result.prevPage,
          nextPage: result.nextPage,
          pagingCounter: result.pagingCounter,
        },
      }

      return ApiResponseBuilder.success<ProductSearchResult>(
        result,
        `Found ${result.totalDocs} products`,
        200,
        meta,
      )
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }
}
