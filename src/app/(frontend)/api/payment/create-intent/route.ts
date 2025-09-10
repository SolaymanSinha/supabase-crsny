import 'reflect-metadata'
import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/functions/payment.function'
import { z } from 'zod'

const createPaymentIntentSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  customerEmail: z.string().email('Valid email is required').optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createPaymentIntentSchema.parse(body)

    const result = await createPaymentIntent(validatedData)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Payment intent creation error:', error)

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
