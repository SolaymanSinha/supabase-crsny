import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { DatabaseError } from '@/lib/utils/errors'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { Company } from '@/payload-types'
import { inject, injectable } from 'tsyringe'

export interface ICompanyRespository {
  getCompany(): Promise<Company>
}

@injectable()
export class CompanyRepository implements ICompanyRespository {
  constructor(
    @inject(PAYLOAD_TOKEN) private readonly payload: Awaited<ReturnType<typeof getPayloadInstance>>,
  ) {}

  async getCompany(): Promise<Company> {
    try {
      return await this.payload.findGlobal({ slug: 'company' })
    } catch (error: unknown) {
      throw new DatabaseError('Could Not Get Company', error)
    }
  }
}
