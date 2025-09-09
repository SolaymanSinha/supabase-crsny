import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { DatabaseError } from '@/lib/utils/errors'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { Product } from '@/payload-types'
import { inject, injectable } from 'tsyringe'
import { Where } from 'payload'

export interface ProductSearchParams {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sort?: string
}

export interface ProductSearchResult {
  docs: Product[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface IProductRepository {
  getBySlug: (slug: string) => Promise<Product>
  search: (params: ProductSearchParams) => Promise<ProductSearchResult>
}

@injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @inject(PAYLOAD_TOKEN) private readonly payload: Awaited<ReturnType<typeof getPayloadInstance>>,
  ) {}

  async getBySlug(slug: string): Promise<Product> {
    try {
      const result = this.payload.find({
        collection: 'products',
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
      })

      const product = (await result).docs[0]

      return product
    } catch (error: unknown) {
      throw new DatabaseError('Failed to get product by slug')
    }
  }

  async search(params: ProductSearchParams): Promise<ProductSearchResult> {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        page = 1,
        limit = 12,
        sort = '-createdAt',
      } = params

      // Build where query
      const whereQuery: Where = {}

      // Text search across title and description
      if (search) {
        whereQuery.or = [
          {
            title: {
              contains: search,
            },
          },
          {
            shortDescription: {
              contains: search,
            },
          },
        ]
      }

      // Category filter
      if (category) {
        whereQuery['category.slug'] = {
          equals: category,
        }
      }

      // Price range filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        whereQuery.basePrice = {}
        if (minPrice !== undefined) {
          whereQuery.basePrice.greater_than_equal = minPrice
        }
        if (maxPrice !== undefined) {
          whereQuery.basePrice.less_than_equal = maxPrice
        }
      }

      const result = await this.payload.find({
        collection: 'products',
        where: whereQuery,
        page,
        limit,
        sort,
        depth: 2, // Include category and media details
      })

      return result as ProductSearchResult
    } catch (error: unknown) {
      throw new DatabaseError('Failed to search products')
    }
  }
}
