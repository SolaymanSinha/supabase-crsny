import { PAGES_SERVICE_TOKEN } from '@/lib/constants/di-tokens/pages'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { AppError } from '@/lib/utils/errors'
import { logger } from '@/lib/utils/logger'
import { Page } from '@/payload-types'
import type { IPagesService } from '@/services/pages.service'
import { inject, injectable } from 'tsyringe'

export interface IPagesController {
  getPages: () => Promise<ApiResponse<Page>>
  getAboutUs: () => Promise<ApiResponse<Page['aboutUs']>>
  getContactUs: () => Promise<ApiResponse<Page['contactUs']>>
  getFaqs: () => Promise<ApiResponse<Page['faqs']>>
  getFeaturedFaqs: () => Promise<
    ApiResponse<
      {
        categoryName: string
        questions: Array<{
          question: string
          answer: any
          featured: boolean
          order: number
        }>
      }[]
    >
  >
}

@injectable()
export class PagesController implements IPagesController {
  constructor(@inject(PAGES_SERVICE_TOKEN) private readonly pagesService: IPagesService) {}

  async getPages(): Promise<ApiResponse<Page>> {
    try {
      const result = await this.pagesService.getPages()
      return ApiResponseBuilder.success<Page>(result, 'Pages content fetched successfully')
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }

  async getAboutUs(): Promise<ApiResponse<Page['aboutUs']>> {
    try {
      const result = await this.pagesService.getAboutUs()
      return ApiResponseBuilder.success<Page['aboutUs']>(
        result,
        'About Us content fetched successfully',
      )
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }

  async getContactUs(): Promise<ApiResponse<Page['contactUs']>> {
    try {
      const result = await this.pagesService.getContactUs()
      return ApiResponseBuilder.success<Page['contactUs']>(
        result,
        'Contact Us content fetched successfully',
      )
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }

  async getFaqs(): Promise<ApiResponse<Page['faqs']>> {
    try {
      const result = await this.pagesService.getFaqs()
      return ApiResponseBuilder.success<Page['faqs']>(result, 'FAQs content fetched successfully')
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }

  async getFeaturedFaqs(): Promise<
    ApiResponse<
      {
        categoryName: string
        questions: Array<{
          question: string
          answer: any
          featured: boolean
          order: number
        }>
      }[]
    >
  > {
    try {
      const result = await this.pagesService.getFeaturedFaqs()
      return ApiResponseBuilder.success(result, 'Featured FAQs fetched successfully')
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }
}
