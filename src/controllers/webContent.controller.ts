import { WEB_CONTENT_SERVICE_TOKEN } from '@/lib/constants/di-tokens/webContent'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { AppError } from '@/lib/utils/errors'
import { logger } from '@/lib/utils/logger'
import { WebContent } from '@/payload-types'
import type { IWebContentService } from '@/services/webContent.service'
import { inject, injectable } from 'tsyringe'

export interface IWebContentController {
  getWebContent: () => Promise<ApiResponse<WebContent>>
}

@injectable()
export class WebContentController implements IWebContentController {
  constructor(
    @inject(WEB_CONTENT_SERVICE_TOKEN) private readonly webContentService: IWebContentService,
  ) {}

  async getWebContent(): Promise<ApiResponse<WebContent>> {
    try {
      const webContent = await this.webContentService.getWebContent()
      return ApiResponseBuilder.success<WebContent>(webContent)
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }

      return ApiResponseBuilder.unknownError()
    }
  }
}
