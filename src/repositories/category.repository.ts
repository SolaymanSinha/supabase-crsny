import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { DatabaseError } from '@/lib/utils/errors'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { logger } from '@/lib/utils/logger'
import { Category } from '@/payload-types'
import { inject, injectable } from 'tsyringe'

export interface ICategoryRepository {
  getAll: () => Promise<Category[]>
  getFeatured: () => Promise<Category[]>
}

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @inject(PAYLOAD_TOKEN) private readonly payload: Awaited<ReturnType<typeof getPayloadInstance>>,
  ) {}

  async getAll(): Promise<Category[]> {
    try {
      const categories = await this.payload.find({
        collection: 'categories',
        pagination: false,
      })
      return categories.docs
    } catch (error: unknown) {
      logger.debug(error)
      throw new DatabaseError('Failed to get all categories')
    }
  }

  async getFeatured(): Promise<Category[]> {
    try {
      const featuredCategories = await this.payload.find({
        collection: 'categories',
        where: {
          featured: {
            equals: true,
          },
        },
      })

      return featuredCategories.docs
    } catch (error) {
      logger.debug(error)
      throw new DatabaseError('Failed to get featured categories')
    }
  }
}
