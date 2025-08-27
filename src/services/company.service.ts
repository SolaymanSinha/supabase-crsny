import { inject, injectable } from 'tsyringe'
import type { ICompanyRespository } from '@/repositories/company.repository'
import { COMPANY_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/company'
import { Company } from '@/payload-types'

export interface ICompanyService {
  getCompany(): Promise<Company>
}

@injectable()
export class CompanyService implements ICompanyService {
  constructor(
    @inject(COMPANY_REPOSITORY_TOKEN) private readonly companyRepository: ICompanyRespository,
  ) {}

  async getCompany() {
    try {
      return await this.companyRepository.getCompany()
    } catch (error: unknown) {
      throw error
    }
  }
}
