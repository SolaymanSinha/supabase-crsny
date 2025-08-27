import { CATEGORY_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/category'
import { logger } from '@/lib/utils/logger'
import { Category } from '@/payload-types'
import type { ICategoryRepository } from '@/repositories/category.repository'
import { inject, injectable } from 'tsyringe'

export interface ICategoryService {
  getAll: () => Promise<Category[]>
  getFeatured: () => Promise<Category[]>
}

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(CATEGORY_REPOSITORY_TOKEN) private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.getAll()
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }

  async getFeatured(): Promise<Category[]> {
    try {
      return this.categoryRepository.getFeatured()
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }
}
