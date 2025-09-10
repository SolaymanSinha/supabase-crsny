'use client'

import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  orderNumber: string
  amount: number
  customerEmail?: string
}

const CheckoutForm = ({ orderNumber, amount, customerEmail }: PaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const [email, setEmail] = useState(customerEmail || '')
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Create payment intent
  const handleCreatePaymentIntent = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderNumber,
          customerEmail: email,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setClientSecret(result.data.clientSecret)
        toast.success('Payment form ready')
      } else {
        toast.error(result.message || 'Failed to create payment intent')
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      toast.error('Failed to initialize payment')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          email,
        },
      },
    })

    if (error) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed')
      setIsProcessing(false)
    } else if (paymentIntent?.status === 'succeeded') {
      // Confirm payment on our backend
      try {
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderNumber,
          }),
        })

        const result = await response.json()

        if (result.success) {
          toast.success('Payment successful!')
          // Refresh the page to show updated payment status
          router.refresh()
        } else {
          toast.error('Payment succeeded but failed to update order')
        }
      } catch (error) {
        console.error('Error confirming payment:', error)
        toast.error('Payment succeeded but failed to update order')
      }

      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Make Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-lg font-medium">Amount: ${amount.toFixed(2)}</span>
        </div>

        {!clientSecret ? (
          // Step 1: Enter email and create payment intent
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <Button
              onClick={handleCreatePaymentIntent}
              disabled={isProcessing || !email}
              className="w-full"
            >
              {isProcessing ? 'Preparing...' : 'Continue to Payment'}
            </Button>
          </div>
        ) : (
          // Step 2: Payment form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Card Details</Label>
              <div className="border rounded-md p-3 mt-1">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
              {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
          </form>
        )}

        <div className="text-xs text-gray-500 text-center">
          Powered by Stripe. Your payment information is secure.
        </div>
      </CardContent>
    </Card>
  )
}

export default function PaymentForm({ orderNumber, amount, customerEmail }: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm orderNumber={orderNumber} amount={amount} customerEmail={customerEmail} />
    </Elements>
  )
}


