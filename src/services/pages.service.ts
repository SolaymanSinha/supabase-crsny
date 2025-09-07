import { PAGES_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/pages'
import { logger } from '@/lib/utils/logger'
import { Page } from '@/payload-types'
import type { IPagesRepository } from '@/repositories/pages.repository'
import { inject, injectable } from 'tsyringe'

export interface IPagesService {
  getPages: () => Promise<Page>
  getAboutUs: () => Promise<Page['aboutUs']>
  getContactUs: () => Promise<Page['contactUs']>
  getFaqs: () => Promise<Page['faqs']>
  getFeaturedFaqs: () => Promise<
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
}

@injectable()
export class PagesService implements IPagesService {
  constructor(@inject(PAGES_REPOSITORY_TOKEN) private readonly pagesRepository: IPagesRepository) {}

  async getPages(): Promise<Page> {
    try {
      return await this.pagesRepository.getPages()
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }

  async getAboutUs(): Promise<Page['aboutUs']> {
    try {
      return await this.pagesRepository.getAboutUs()
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }

  async getContactUs(): Promise<Page['contactUs']> {
    try {
      return await this.pagesRepository.getContactUs()
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }

  async getFaqs(): Promise<Page['faqs']> {
    try {
      return await this.pagesRepository.getFaqs()
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }

  async getFeaturedFaqs(): Promise<
    {
      categoryName: string
      questions: Array<{
        question: string
        answer: any
        featured: boolean
        order: number
      }>
    }[]
  > {
    try {
      const faqs = await this.getFaqs()

      if (!faqs.categories) {
        return []
      }

      // Filter and transform categories to only include featured questions
      const featuredCategories = faqs.categories
        .map((category) => ({
          categoryName: category.categoryName,
          questions: (category.questions || [])
            .filter((q) => q.featured)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((q) => ({
              question: q.question,
              answer: q.answer,
              featured: q.featured || false,
              order: q.order || 0,
            })),
        }))
        .filter((category) => category.questions.length > 0)

      return featuredCategories
    } catch (error: unknown) {
      logger.debug(error)
      throw error
    }
  }
}
