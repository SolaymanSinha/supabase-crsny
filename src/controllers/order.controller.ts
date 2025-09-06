import { inject, injectable } from 'tsyringe'
import { OrderService } from '@/services/order.service'
import { ORDER_SERVICE_TOKEN } from '@/lib/constants/di-tokens/order'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'
import { Order } from '@/payload-types'
import { CreateOrderData } from '@/repositories/order.repository'
import { Cart } from '@/lib/atoms/cart'

@injectable()
export class OrderController {
  constructor(@inject(ORDER_SERVICE_TOKEN) private orderService: OrderService) {}

  async createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
    try {
      const order = await this.orderService.createOrder(orderData)
      return ApiResponseBuilder.success(order, 'Order created successfully')
    } catch (error) {
      console.error('Error creating order:', error)
      return ApiResponseBuilder.error('ORDER_CREATE_FAILED', 'Failed to create order')
    }
  }

  async createOrderFromCart(
    cart: Cart,
    customerInfo: CreateOrderData['customerInfo'],
    shippingAddress: CreateOrderData['shippingAddress'],
    billingAddress: CreateOrderData['billingAddress'],
  ): Promise<ApiResponse<Order>> {
    try {
      const order = await this.orderService.createOrderFromCart(
        cart,
        customerInfo,
        shippingAddress,
        billingAddress,
      )
      return ApiResponseBuilder.success(order, 'Order created successfully from cart')
    } catch (error) {
      console.error('Error creating order from cart:', error)
      return ApiResponseBuilder.error('ORDER_FROM_CART_FAILED', 'Failed to create order from cart')
    }
  }

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    try {
      const order = await this.orderService.getOrderById(id)
      if (!order) {
        return ApiResponseBuilder.error('ORDER_NOT_FOUND', 'Order not found')
      }
      return ApiResponseBuilder.success(order, 'Order retrieved successfully')
    } catch (error) {
      console.error('Error getting order by ID:', error)
      return ApiResponseBuilder.error('ORDER_RETRIEVAL_FAILED', 'Failed to retrieve order')
    }
  }

  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    try {
      const order = await this.orderService.getOrderByNumber(orderNumber)
      if (!order) {
        return ApiResponseBuilder.error('ORDER_NOT_FOUND', 'Order not found')
      }
      return ApiResponseBuilder.success(order, 'Order retrieved successfully')
    } catch (error) {
      console.error('Error getting order by number:', error)
      return ApiResponseBuilder.error('ORDER_RETRIEVAL_FAILED', 'Failed to retrieve order')
    }
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
  ): Promise<ApiResponse<Order>> {
    try {
      const order = await this.orderService.updateOrderStatus(id, status)
      if (!order) {
        return ApiResponseBuilder.error('ORDER_UPDATE_FAILED', 'Order not found or update failed')
      }
      return ApiResponseBuilder.success(order, 'Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)
      return ApiResponseBuilder.error('ORDER_STATUS_UPDATE_FAILED', 'Failed to update order status')
    }
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  ): Promise<ApiResponse<Order>> {
    try {
      const order = await this.orderService.updatePaymentStatus(id, paymentStatus)
      if (!order) {
        return ApiResponseBuilder.error('PAYMENT_UPDATE_FAILED', 'Order not found or update failed')
      }
      return ApiResponseBuilder.success(order, 'Payment status updated successfully')
    } catch (error) {
      console.error('Error updating payment status:', error)
      return ApiResponseBuilder.error(
        'PAYMENT_STATUS_UPDATE_FAILED',
        'Failed to update payment status',
      )
    }
  }

  async getAllOrders(
    page = 1,
    limit = 10,
  ): Promise<ApiResponse<{ docs: Order[]; totalPages: number; totalDocs: number }>> {
    try {
      const result = await this.orderService.getAllOrders(page, limit)
      return ApiResponseBuilder.success(result, 'Orders retrieved successfully')
    } catch (error) {
      console.error('Error getting all orders:', error)
      return ApiResponseBuilder.error('ORDERS_RETRIEVAL_FAILED', 'Failed to retrieve orders')
    }
  }
}
