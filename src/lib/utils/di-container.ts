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
import {
  CATEGORY_CONTROLLER_TOKEN,
  CATEGORY_REPOSITORY_TOKEN,
  CATEGORY_SERVICE_TOKEN,
} from '../constants/di-tokens/category'
import { CategoryRepository } from '@/repositories/category.repository'
import { CategoryService } from '@/services/category.service'
import { CategoryController } from '@/controllers/category.controller'

const payload = await getPayloadInstance()

container.register(PAYLOAD_TOKEN, {
  useValue: payload,
})

// * Company
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

// * Category
container.register(
  CATEGORY_REPOSITORY_TOKEN,
  {
    useClass: CategoryRepository,
  },
  { lifecycle: Lifecycle.ContainerScoped },
)

container.register(
  CATEGORY_SERVICE_TOKEN,
  {
    useClass: CategoryService,
  },
  { lifecycle: Lifecycle.Transient },
)

container.register(
  CATEGORY_CONTROLLER_TOKEN,
  {
    useClass: CategoryController,
  },
  { lifecycle: Lifecycle.Transient },
)

export { container }
