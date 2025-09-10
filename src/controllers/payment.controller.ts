import { inject, injectable } from 'tsyringe'
import { PaymentService, CreatePaymentIntentData } from '@/services/payment.service'
import { OrderService } from '@/services/order.service'
import { PAYMENT_SERVICE_TOKEN } from '@/lib/constants/di-tokens/payment'
import { ORDER_SERVICE_TOKEN } from '@/lib/constants/di-tokens/order'
import { ApiResponse, ApiResponseBuilder } from '@/lib/utils/api-response'

export interface CreatePaymentIntentRequest {
  orderNumber: string
  customerEmail?: string
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string
  orderNumber: string
}

@injectable()
export class PaymentController {
  constructor(
    @inject(PAYMENT_SERVICE_TOKEN) private paymentService: PaymentService,
    @inject(ORDER_SERVICE_TOKEN) private orderService: OrderService,
  ) {}

  /**
   * Create payment intent for an order
   */
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<ApiResponse<any>> {
    try {
      const { orderNumber, customerEmail } = request

      // Get order details
      const orderResponse = await this.orderService.getOrderByNumber(orderNumber)
      if (!orderResponse) {
        return ApiResponseBuilder.error('ORDER_NOT_FOUND', 'Order not found')
      }

      const order = orderResponse

      // Use provided email or order customer email
      const email = customerEmail || order.customerInfo.email

      // Create payment intent
      const paymentData: CreatePaymentIntentData = {
        amount: Math.round(order.totalAmount * 100), // Convert to cents
        currency: 'usd', // Default currency
        orderNumber: order.orderNumber,
        customerEmail: email,
        orderId: String(order.id),
      }

      const result = await this.paymentService.createPaymentIntent(paymentData)

      return ApiResponseBuilder.success(
        {
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          amount: order.totalAmount,
          currency: 'usd',
        },
        'Payment intent created successfully',
      )
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return ApiResponseBuilder.error(
        'PAYMENT_INTENT_FAILED',
        error instanceof Error ? error.message : 'Failed to create payment intent',
      )
    }
  }

  /**
   * Confirm payment and update order
   */
  async confirmPayment(request: ConfirmPaymentRequest): Promise<ApiResponse<any>> {
    try {
      const { paymentIntentId, orderNumber } = request

      // Confirm payment with Stripe
      const paymentDetails = await this.paymentService.confirmPayment(paymentIntentId)

      // Get order
      const order = await this.orderService.getOrderByNumber(orderNumber)
      if (!order) {
        return ApiResponseBuilder.error('ORDER_NOT_FOUND', 'Order not found')
      }

      // Update order with payment information
      const updatedOrder = await this.orderService.updateOrderPayment(String(order.id), {
        paymentStatus: 'paid',
        paymentIntentId: paymentDetails.paymentIntentId,
        paymentEmail: paymentDetails.customerEmail || order.customerInfo.email,
        paymentMethod: String(paymentDetails.paymentMethodId),
        paidAt: paymentDetails.createdAt.toISOString(),
      })

      if (!updatedOrder) {
        return ApiResponseBuilder.error('ORDER_UPDATE_FAILED', 'Failed to update order')
      }

      return ApiResponseBuilder.success(
        {
          orderNumber: updatedOrder.orderNumber,
          paymentStatus: updatedOrder.paymentStatus,
          paidAt: updatedOrder.paidAt,
        },
        'Payment confirmed successfully',
      )
    } catch (error) {
      console.error('Error confirming payment:', error)
      return ApiResponseBuilder.error(
        'PAYMENT_CONFIRMATION_FAILED',
        error instanceof Error ? error.message : 'Failed to confirm payment',
      )
    }
  }

  /**
   * Get payment status for an order
   */
  async getPaymentStatus(orderNumber: string): Promise<ApiResponse<any>> {
    try {
      const order = await this.orderService.getOrderByNumber(orderNumber)
      if (!order) {
        return ApiResponseBuilder.error('ORDER_NOT_FOUND', 'Order not found')
      }

      return ApiResponseBuilder.success(
        {
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          paymentIntentId: order.paymentIntentId,
          paidAt: order.paidAt,
        },
        'Payment status retrieved successfully',
      )
    } catch (error) {
      console.error('Error getting payment status:', error)
      return ApiResponseBuilder.error('PAYMENT_STATUS_FAILED', 'Failed to get payment status')
    }
  }
}


