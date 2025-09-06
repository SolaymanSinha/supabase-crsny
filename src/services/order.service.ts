import { inject, injectable } from 'tsyringe'
import { OrderRepository, CreateOrderData } from '@/repositories/order.repository'
import { ORDER_REPOSITORY_TOKEN } from '@/lib/constants/di-tokens/order'
import { Order } from '@/payload-types'
import { Cart } from '@/lib/atoms/cart'

@injectable()
export class OrderService {
  constructor(@inject(ORDER_REPOSITORY_TOKEN) private orderRepository: OrderRepository) {}

  async createOrder(orderData: CreateOrderData): Promise<Order> {
    return await this.orderRepository.create(orderData)
  }

  async createOrderFromCart(
    cart: Cart,
    customerInfo: CreateOrderData['customerInfo'],
    shippingAddress: CreateOrderData['shippingAddress'],
    billingAddress: CreateOrderData['billingAddress'],
  ): Promise<Order> {
    const orderData: CreateOrderData = {
      items: cart.items.map((item) => ({
        product: parseInt(item.productId), // Convert string to number
        selectedVariant: item.selectedVariant,
        price: item.price,
        quantity: item.quantity,
        uploadedFiles: item.uploadedFiles?.map((upload) => ({
          fieldLabel: upload.fieldLabel,
          files: [], // TODO: Handle file uploads properly in the future
        })),
      })),
      totalItems: cart.totalItems,
      totalAmount: cart.totalPrice,
      customerInfo,
      shippingAddress,
      billingAddress,
      status: 'pending',
      paymentStatus: 'pending',
      cartSessionId: `cart_${Date.now()}`, // Generate a session ID for now
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
    }

    return await this.createOrder(orderData)
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.orderRepository.findById(id)
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    return await this.orderRepository.findByOrderNumber(orderNumber)
  }

  async updateOrderStatus(
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
    return await this.orderRepository.updateStatus(id, status)
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  ): Promise<Order | null> {
    return await this.orderRepository.updatePaymentStatus(id, paymentStatus)
  }

  async getAllOrders(
    page = 1,
    limit = 10,
  ): Promise<{ docs: Order[]; totalPages: number; totalDocs: number }> {
    return await this.orderRepository.findAll(page, limit)
  }
}
