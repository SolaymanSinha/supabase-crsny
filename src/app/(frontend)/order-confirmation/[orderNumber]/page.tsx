import { getOrderByNumber } from '@/functions/order.function'
import { notFound } from 'next/navigation'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PaymentForm from '@/components/forms/payment-form'

const OrderConfirmationPage = async ({ params }: { params: Promise<{ orderNumber: string }> }) => {
  const { orderNumber } = await params
  const { data: order } = await getOrderByNumber(orderNumber)

  if (!order) {
    notFound()
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'confirmed':
        return 'bg-blue-500'
      case 'processing':
        return 'bg-purple-500'
      case 'shipped':
        return 'bg-orange-500'
      case 'delivered':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'refunded':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'paid':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      case 'refunded':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order Confirmation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Order Number:</span>
                <span className="ml-2">{order.orderNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <Badge className={getStatusBadgeColor(order.status)}>{order.status}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Payment Status:</span>
                <Badge className={getPaymentStatusBadgeColor(order.paymentStatus)}>
                  {order.paymentStatus}
                </Badge>
              </div>

              <div>
                <span className="font-medium">Total Items:</span>
                <span className="ml-2">{order.totalItems}</span>
              </div>

              <div>
                <span className="font-medium">Total Amount:</span>
                <span className="ml-2 text-xl font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>

              <div>
                <span className="font-medium">Order Date:</span>
                <span className="ml-2">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">{order.customerInfo.name}</span>
              </div>

              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2">{order.customerInfo.email}</span>
              </div>

              {order.customerInfo.phone && (
                <div>
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{order.customerInfo.phone}</span>
                </div>
              )}

              <div>
                <div className="font-medium mb-2">Shipping Address:</div>
                <div className="text-sm text-gray-600">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section - Only show if payment is pending */}
        {order.paymentStatus === 'pending' && (
          <div className="mt-8">
            <div className="flex justify-center w-full">
              <PaymentForm
                orderNumber={order.orderNumber}
                amount={order.totalAmount}
                customerEmail={order.customerInfo.email}
              />
            </div>
          </div>
        )}

        {/* Success Message - Show if payment is completed */}
        {order.paymentStatus === 'paid' && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-green-600 text-xl font-semibold mb-2">
                  ✅ Payment Completed Successfully!
                </div>
                <p className="text-gray-600">
                  Thank you for your payment. Your order is now being processed.
                </p>
                {order.paidAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Paid on: {new Date(order.paidAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Items */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {typeof item.product === 'object' ? item.product.title : 'Product'}
                      </h4>

                      {item.selectedVariant && item.selectedVariant.length > 0 && (
                        <div className="text-sm text-gray-600">
                          {item.selectedVariant.map((variant, variantIndex) => (
                            <span key={variantIndex}>
                              {variant.variantName}: {variant.variantValue}
                              {variantIndex < (item.selectedVariant?.length || 0) - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>

                      <div className="font-medium">${item.price.toFixed(2)} each</div>
                    </div>

                    <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No items found in this order.</p>
              )}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
