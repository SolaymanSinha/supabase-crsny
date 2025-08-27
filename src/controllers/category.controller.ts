'use server'
import { CATEGORY_SERVICE_TOKEN } from '@/lib/constants/di-tokens/category'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { AppError } from '@/lib/utils/errors'
import { logger } from '@/lib/utils/logger'
import { Category } from '@/payload-types'
import type { ICategoryService } from '@/services/category.service'
import { inject, injectable } from 'tsyringe'

interface ICategoryController {
  getAll: () => Promise<ApiResponse<Category[]>>
  getFeatured: () => Promise<ApiResponse<Category[]>>
}

@injectable()
export class CategoryController implements ICategoryController {
  constructor(@inject(CATEGORY_SERVICE_TOKEN) private readonly categoryService: ICategoryService) {}

  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const result = await this.categoryService.getAll()

      return ApiResponseBuilder.success<Category[]>(result, 'All Categories fetched successfully')
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }

  async getFeatured(): Promise<ApiResponse<Category[]>> {
    try {
      const result = await this.categoryService.getFeatured()

      return ApiResponseBuilder.success<Category[]>(
        result,
        'Featured categories fetched successfully',
      )
    } catch (error: unknown) {
      logger.debug(error)
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }
      return ApiResponseBuilder.unknownError()
    }
  }
}
