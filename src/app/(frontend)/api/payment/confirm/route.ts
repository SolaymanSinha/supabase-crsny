import 'reflect-metadata'
import { NextRequest, NextResponse } from 'next/server'
import { confirmPayment } from '@/functions/payment.function'
import { z } from 'zod'

const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().min(1, 'Payment intent ID is required'),
  orderNumber: z.string().min(1, 'Order number is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = confirmPaymentSchema.parse(body)

    const result = await confirmPayment(validatedData)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Payment confirmation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 },
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
