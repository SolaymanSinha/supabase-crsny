'use server'
import {
  PaymentController,
  CreatePaymentIntentRequest,
  ConfirmPaymentRequest,
} from '@/controllers/payment.controller'
import { PAYMENT_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/payment'
import { ApiResponse } from '@/lib/utils/api-response'
import { container } from '@/lib/utils/di-container'

const paymentController = container.resolve<PaymentController>(PAYMENT_CONTROLLER_TOKEN)

export async function createPaymentIntent(
  request: CreatePaymentIntentRequest,
): Promise<ApiResponse<any>> {
  return await paymentController.createPaymentIntent(request)
}

export async function confirmPayment(request: ConfirmPaymentRequest): Promise<ApiResponse<any>> {
  return await paymentController.confirmPayment(request)
}

export async function getPaymentStatus(orderNumber: string): Promise<ApiResponse<any>> {
  return await paymentController.getPaymentStatus(orderNumber)
}


