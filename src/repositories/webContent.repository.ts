import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { DatabaseError } from '@/lib/utils/errors'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { logger } from '@/lib/utils/logger'
import { WebContent } from '@/payload-types'
import { inject, injectable } from 'tsyringe'

export interface IWebContentRepository {
  getWebContent: () => Promise<WebContent>
  // getFeaturedProducts: () => Promise<Product[]>
  // getHeroImage: () => Promise<WebContent['heroImage']>
}

@injectable()
export class WebContentRepository implements IWebContentRepository {
  constructor(
    @inject(PAYLOAD_TOKEN) private readonly payload: Awaited<ReturnType<typeof getPayloadInstance>>,
  ) {}

  async getWebContent(): Promise<WebContent> {
    try {
      const webContent = await this.payload.findGlobal({
        slug: 'web-contents',
        depth: 2,
      })

      return webContent
    } catch (error: unknown) {
      logger.debug(error)
      throw new DatabaseError('Failed to get web content')
    }
  }
}
