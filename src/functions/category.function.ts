'use server'

import { container } from '@/lib/utils/di-container'
import { CATEGORY_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/category'
import { CategoryController } from '@/controllers/category.controller'
import { ApiResponse } from '@/lib/utils/api-response'
import { Category } from '@/payload-types'

const categoryController = container.resolve<CategoryController>(CATEGORY_CONTROLLER_TOKEN)

export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
  return await categoryController.getAll()
}

export async function getFeaturedCategories(): Promise<ApiResponse<Category[]>> {
  return await categoryController.getFeatured()
}
