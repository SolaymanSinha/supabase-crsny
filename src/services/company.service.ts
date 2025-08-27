import { inject, injectable } from 'tsyringe'
import { CompanyRepository } from '@/repositories/company.repository'
import { COMPANY_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/company'

@injectable()
export class CompanyService {
  constructor(
    @inject(COMPANY_REPOSITORY_TOKEN) private readonly companyRepository: CompanyRepository,
  ) {}

  async getCompany() {
    try {
      return await this.companyRepository.getCompany()
    } catch (error: unknown) {
      throw error
    }
  }
}
