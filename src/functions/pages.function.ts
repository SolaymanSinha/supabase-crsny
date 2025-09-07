'use server'

import { PagesController } from '@/controllers/pages.controller'
import { PAGES_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/pages'
import { ApiResponse } from '@/lib/utils/api-response'
import { container } from '@/lib/utils/di-container'
import { Page } from '@/payload-types'

const pagesController = container.resolve<PagesController>(PAGES_CONTROLLER_TOKEN)

export async function getPages(): Promise<ApiResponse<Page>> {
  return await pagesController.getPages()
}

export async function getAboutUs(): Promise<ApiResponse<Page['aboutUs']>> {
  return await pagesController.getAboutUs()
}

export async function getContactUs(): Promise<ApiResponse<Page['contactUs']>> {
  return await pagesController.getContactUs()
}

export async function getFaqs(): Promise<ApiResponse<Page['faqs']>> {
  return await pagesController.getFaqs()
}

export async function getFeaturedFaqs(): Promise<
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
  return await pagesController.getFeaturedFaqs()
}
