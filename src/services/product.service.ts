import { PRODUCT_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/product'
import { logger } from '@/lib/utils/logger'
import { Product } from '@/payload-types'
import type {
  IProductRepository,
  ProductSearchParams,
  ProductSearchResult,
} from '@/repositories/product.repository'
import { inject, injectable } from 'tsyringe'

export interface IProductService {
  getBySlug: (slug: string) => Promise<Product>
  search: (params: ProductSearchParams) => Promise<ProductSearchResult>
}

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(PRODUCT_REPOSITORY_TOKEN) private readonly productRepository: IProductRepository,
  ) {}

  async getBySlug(slug: string) {
    try {
      const result = await this.productRepository.getBySlug(slug)
      return result
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }

  async search(params: ProductSearchParams) {
    try {
      // Validate and sanitize params
      const searchParams: ProductSearchParams = {
        ...params,
        page: Math.max(1, params.page || 1),
        limit: Math.min(50, Math.max(1, params.limit || 12)), // Limit between 1-50
      }

      const result = await this.productRepository.search(searchParams)

      logger.info(`Product search executed with ${result.totalDocs} total results`)

      return result
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }
}
