import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { DatabaseError } from '@/lib/utils/errors'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { Product } from '@/payload-types'
import { inject, injectable } from 'tsyringe'

export interface IProductRepository {
  getBySlug: (slug: string) => Promise<Product>
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
      })

      const product = (await result).docs[0]

      return product
    } catch (error: unknown) {
      throw new DatabaseError('Failed to get product by slug')
    }
  }
}
