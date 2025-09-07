import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { DatabaseError } from '@/lib/utils/errors'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { logger } from '@/lib/utils/logger'
import { Page } from '@/payload-types'
import { inject, injectable } from 'tsyringe'

export interface IPagesRepository {
  getPages: () => Promise<Page>
  getAboutUs: () => Promise<Page['aboutUs']>
  getContactUs: () => Promise<Page['contactUs']>
  getFaqs: () => Promise<Page['faqs']>
}

@injectable()
export class PagesRepository implements IPagesRepository {
  constructor(
    @inject(PAYLOAD_TOKEN) private readonly payload: Awaited<ReturnType<typeof getPayloadInstance>>,
  ) {}

  async getPages(): Promise<Page> {
    try {
      const pages = await this.payload.findGlobal({
        slug: 'pages',
        depth: 2,
      })

      return pages
    } catch (error: unknown) {
      logger.debug(error)
      throw new DatabaseError('Failed to get pages content')
    }
  }

  async getAboutUs(): Promise<Page['aboutUs']> {
    try {
      const pages = await this.getPages()

      if (!pages.aboutUs?.enabled) {
        throw new DatabaseError('About Us page is disabled')
      }

      return pages.aboutUs
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Failed to get About Us content')
    }
  }

  async getContactUs(): Promise<Page['contactUs']> {
    try {
      const pages = await this.getPages()

      if (!pages.contactUs?.enabled) {
        throw new DatabaseError('Contact Us page is disabled')
      }

      return pages.contactUs
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Failed to get Contact Us content')
    }
  }

  async getFaqs(): Promise<Page['faqs']> {
    try {
      const pages = await this.getPages()

      if (!pages.faqs?.enabled) {
        throw new DatabaseError('FAQs page is disabled')
      }

      return pages.faqs
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Failed to get FAQs content')
    }
  }
}
