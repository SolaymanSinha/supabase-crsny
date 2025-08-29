import { PRODUCT_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/product'
import { logger } from '@/lib/utils/logger'
import { Product } from '@/payload-types'
import type { IProductRepository } from '@/repositories/product.repository'
import { inject, injectable } from 'tsyringe'

export interface IProductService {
  getBySlug: (slug: string) => Promise<Product>
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
}
