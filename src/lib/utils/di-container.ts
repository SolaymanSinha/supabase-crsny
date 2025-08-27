import { container, Lifecycle } from 'tsyringe'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import {
  COMPANY_CONTROLLER_TOKEN,
  COMPANY_REPOSITORY_TOKEN,
  COMPANY_SERVICE_TOKEN,
} from '@/lib/constants/di-tokens/company'
import { CompanyRepository } from '@/repositories/company.repository'
import { CompanyService } from '@/services/company.service'
import { CompanyController } from '@/controllers/company.controller'

const payload = await getPayloadInstance()

container.register(PAYLOAD_TOKEN, {
  useValue: payload,
})

// * Registering Company
container.register(
  COMPANY_REPOSITORY_TOKEN,
  {
    useClass: CompanyRepository,
  },
  { lifecycle: Lifecycle.ContainerScoped },
)

container.register(
  COMPANY_SERVICE_TOKEN,
  {
    useClass: CompanyService,
  },
  { lifecycle: Lifecycle.Transient },
)

container.register(
  COMPANY_CONTROLLER_TOKEN,
  {
    useClass: CompanyController,
  },
  { lifecycle: Lifecycle.Transient },
)

export { container }
