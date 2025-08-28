import { WEB_CONTENT_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/webContent'
import { logger } from '@/lib/utils/logger'
import { WebContent } from '@/payload-types'
import type { IWebContentRepository } from '@/repositories/webContent.repository'
import { inject, injectable } from 'tsyringe'

export interface IWebContentService {
  getWebContent: () => Promise<WebContent>
}

@injectable()
export class WebContentService implements IWebContentService {
  constructor(
    @inject(WEB_CONTENT_REPOSITORY_TOKEN)
    private readonly webContentRepository: IWebContentRepository,
  ) {}

  async getWebContent(): Promise<WebContent> {
    try {
      const webContent = await this.webContentRepository.getWebContent()

      return webContent
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }
}
