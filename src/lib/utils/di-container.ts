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
import {
  WEB_CONTENT_CONTROLLER_TOKEN,
  WEB_CONTENT_REPOSITORY_TOKEN,
  WEB_CONTENT_SERVICE_TOKEN,
} from '../constants/di-tokens/webContent'
import { WebContentRepository } from '@/repositories/webContent.repository'
import { WebContentService } from '@/services/webContent.service'
import { WebContentController } from '@/controllers/webContent.controller'
import {
  PRODUCT_CONTROLLER_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  PRODUCT_SERVICE_TOKEN,
} from '../constants/di-tokens/product'
import { ProductRepository } from '@/repositories/product.repository'
import { ProductService } from '@/services/product.service'
import { ProductController } from '@/controllers/product.controller'
import {
  ORDER_CONTROLLER_TOKEN,
  ORDER_REPOSITORY_TOKEN,
  ORDER_SERVICE_TOKEN,
} from '../constants/di-tokens/order'
import { OrderRepository } from '@/repositories/order.repository'
import { OrderService } from '@/services/order.service'
import { OrderController } from '@/controllers/order.controller'

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

// * Web Content
container.register(
  WEB_CONTENT_REPOSITORY_TOKEN,
  {
    useClass: WebContentRepository,
  },
  { lifecycle: Lifecycle.ContainerScoped },
)

container.register(
  WEB_CONTENT_SERVICE_TOKEN,
  {
    useClass: WebContentService,
  },
  { lifecycle: Lifecycle.Transient },
)

container.register(
  WEB_CONTENT_CONTROLLER_TOKEN,
  {
    useClass: WebContentController,
  },
  { lifecycle: Lifecycle.Transient },
)

// * Product
container.register(
  PRODUCT_REPOSITORY_TOKEN,
  {
    useClass: ProductRepository,
  },
  { lifecycle: Lifecycle.ContainerScoped },
)

container.register(
  PRODUCT_SERVICE_TOKEN,
  {
    useClass: ProductService,
  },
  { lifecycle: Lifecycle.Transient },
)

container.register(
  PRODUCT_CONTROLLER_TOKEN,
  {
    useClass: ProductController,
  },
  { lifecycle: Lifecycle.Transient },
)

// * Order
container.register(
  ORDER_REPOSITORY_TOKEN,
  {
    useClass: OrderRepository,
  },
  { lifecycle: Lifecycle.ContainerScoped },
)

container.register(
  ORDER_SERVICE_TOKEN,
  {
    useClass: OrderService,
  },
  { lifecycle: Lifecycle.Transient },
)

container.register(
  ORDER_CONTROLLER_TOKEN,
  {
    useClass: OrderController,
  },
  { lifecycle: Lifecycle.Transient },
)

export { container }
