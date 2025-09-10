import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/functions/payment.function'

interface RouteParams {
  params: Promise<{ orderNumber: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { orderNumber } = await params

    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order number is required',
        },
        { status: 400 },
      )
    }

    const result = await getPaymentStatus(orderNumber)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error('Payment status error:', error)

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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}


