import { injectable } from 'tsyringe'
import Stripe from 'stripe'

export interface CreatePaymentIntentData {
  amount: number // Amount in cents
  currency: string
  orderNumber: string
  customerEmail: string
  orderId: string
}

export interface PaymentIntentResult {
  clientSecret: string
  paymentIntentId: string
}

@injectable()
export class PaymentService {
  private stripe: Stripe

  constructor() {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    })
  }

  /**
   * Create a payment intent for an order
   */
  async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentIntentResult> {
    try {
      const { amount, currency, orderNumber, customerEmail, orderId } = data

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        receipt_email: customerEmail,
        metadata: {
          orderNumber,
          orderId,
          customerEmail,
        },
        description: `Payment for order ${orderNumber}`,
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  /**
   * Retrieve payment intent details
   */
  async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.retrieve(paymentIntentId)
    } catch (error) {
      console.error('Error retrieving payment intent:', error)
      throw new Error('Failed to retrieve payment intent')
    }
  }

  /**
   * Confirm payment success and get payment details
   */
  async confirmPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`)
      }

      return {
        paymentIntentId: paymentIntent.id,
        customerEmail: paymentIntent.receipt_email || paymentIntent.metadata?.customerEmail,
        paymentMethodId: paymentIntent.payment_method,
        amountReceived: paymentIntent.amount_received,
        currency: paymentIntent.currency,
        createdAt: new Date(paymentIntent.created * 1000),
        metadata: paymentIntent.metadata,
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  /**
   * Create or retrieve a Stripe customer
   */
  async createOrGetCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    try {
      // First, try to find existing customer
      const existingCustomers = await this.stripe.customers.list({
        email,
        limit: 1,
      })

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0]
      }

      // Create new customer if not found
      return await this.stripe.customers.create({
        email,
        name,
      })
    } catch (error) {
      console.error('Error creating/retrieving customer:', error)
      throw new Error('Failed to handle customer')
    }
  }
}
