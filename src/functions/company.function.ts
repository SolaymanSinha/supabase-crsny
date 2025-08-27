'use server'

import { container } from '@/lib/utils/di-container'
import { COMPANY_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/company'
import { CompanyController } from '@/controllers/company.controller'
import { ApiResponse } from '@/lib/utils/api-response'
import { Company } from '@/payload-types'

const companyController = container.resolve<CompanyController>(COMPANY_CONTROLLER_TOKEN)

export async function getCompany(): Promise<ApiResponse<Company>> {
  return await companyController.getCompany()
}
