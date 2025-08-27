// 'use server'
import { COMPANY_SERVICE_TOKEN } from '@/lib/constants/di-tokens/company'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { AppError } from '@/lib/utils/errors'
import { Company } from '@/payload-types'
import type { ICompanyService } from '@/services/company.service'
import { inject, injectable } from 'tsyringe'

export interface ICompanyController {
  getCompany(): Promise<ApiResponse<Company>>
}

@injectable()
export class CompanyController implements ICompanyController {
  constructor(@inject(COMPANY_SERVICE_TOKEN) private readonly companyService: ICompanyService) {}

  async getCompany(): Promise<ApiResponse<Company>> {
    try {
      const result = await this.companyService.getCompany()
      return ApiResponseBuilder.success(result, 'Company fetched successfully')
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return ApiResponseBuilder.fromError(error)
      }

      return ApiResponseBuilder.unknownError()
    }
  }
}
