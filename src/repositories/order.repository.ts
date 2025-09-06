import { inject, injectable } from 'tsyringe'
import { PAYLOAD_TOKEN } from '@/lib/constants/di-tokens/global'
import { Order } from '@/payload-types'
import { getPayloadInstance } from '@/lib/utils/getPayload'

export interface CreateOrderData {
  items: Array<{
    product: number
    selectedVariant: Array<{
      variantName: string
      variantValue: string
    }>
    price: number
    quantity: number
    uploadedFiles?: Array<{
      fieldLabel: string
      files: number[]
    }>
  }>
  totalItems: number
  totalAmount: number
  customerInfo: {
    name: string
    email: string
    phone?: string
  }
  shippingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  billingAddress: {
    sameAsShipping: boolean
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  cartSessionId?: string
  notes?: string
  orderNumber: string
}

@injectable()
export class OrderRepository {
  constructor(
    @inject(PAYLOAD_TOKEN) private payload: Awaited<ReturnType<typeof getPayloadInstance>>,
  ) {}

  async create(data: CreateOrderData): Promise<Order> {
    const result = await this.payload.create({
      collection: 'orders',
      data,
    })
    return result
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const result = await this.payload.findByID({
        collection: 'orders',
        id,
      })
      return result
    } catch (error) {
      return null
    }
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const result = await this.payload.find({
      collection: 'orders',
      where: {
        orderNumber: {
          equals: orderNumber,
        },
      },
      limit: 1,
    })
    return result.docs[0] || null
  }

  async updateStatus(
    id: string,
    status:
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled'
      | 'refunded',
  ): Promise<Order | null> {
    try {
      const result = await this.payload.update({
        collection: 'orders',
        id,
        data: {
          status,
        },
      })
      return result
    } catch (error) {
      return null
    }
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  ): Promise<Order | null> {
    try {
      const result = await this.payload.update({
        collection: 'orders',
        id,
        data: {
          paymentStatus,
        },
      })
      return result
    } catch (error) {
      return null
    }
  }

  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ docs: Order[]; totalPages: number; totalDocs: number }> {
    const result = await this.payload.find({
      collection: 'orders',
      page,
      limit,
      sort: '-createdAt',
    })
    return result
  }
}
