'use server'
import { OrderController } from '@/controllers/order.controller'
import { ORDER_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/order'
import { ApiResponse } from '@/lib/utils/api-response'
import { container } from '@/lib/utils/di-container'
import { Order } from '@/payload-types'
import { CreateOrderData } from '@/repositories/order.repository'
import { Cart } from '@/lib/atoms/cart'

const orderController = container.resolve<OrderController>(ORDER_CONTROLLER_TOKEN)

export async function createOrder(orderData: CreateOrderData): Promise<ApiResponse<Order>> {
  return await orderController.createOrder(orderData)
}

export async function createOrderFromCart(
  cart: Cart,
  customerInfo: CreateOrderData['customerInfo'],
  shippingAddress: CreateOrderData['shippingAddress'],
  billingAddress: CreateOrderData['billingAddress'],
): Promise<ApiResponse<Order>> {
  return await orderController.createOrderFromCart(
    cart,
    customerInfo,
    shippingAddress,
    billingAddress,
  )
}

export async function getOrderById(id: string): Promise<ApiResponse<Order>> {
  return await orderController.getOrderById(id)
}

export async function getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
  return await orderController.getOrderByNumber(orderNumber)
}

export async function updateOrderStatus(
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
  return await orderController.updateOrderStatus(id, status)
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
): Promise<ApiResponse<Order>> {
  return await orderController.updatePaymentStatus(id, paymentStatus)
}

export async function getAllOrders(
  page = 1,
  limit = 10,
): Promise<ApiResponse<{ docs: Order[]; totalPages: number; totalDocs: number }>> {
  return await orderController.getAllOrders(page, limit)
}
