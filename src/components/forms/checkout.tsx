'use client'

import React from 'react'
import { useAtom } from 'jotai'
import { cartAtom, clearCartAtom } from '@/lib/atoms/cart'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createOrderFromCart } from '@/functions/order.function'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const checkoutSchema = z.object({
  customerInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
  }),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  billingAddress: z.object({
    sameAsShipping: z.boolean().default(true),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export const CheckoutForm = () => {
  const [cart] = useAtom(cartAtom)
  const [, clearCart] = useAtom(clearCartAtom)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema) as any,
    defaultValues: {
      customerInfo: {
        name: '',
        email: '',
        phone: '',
      },
      shippingAddress: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      billingAddress: {
        sameAsShipping: true,
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
  })

  const sameAsShipping = form.watch('billingAddress.sameAsShipping')

  const onSubmit = async (values: CheckoutFormData) => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createOrderFromCart(
        cart,
        values.customerInfo,
        values.shippingAddress,
        values.billingAddress,
      )

      if (result.success && result.data) {
        clearCart()
        toast.success('Order placed successfully!')
        router.push(`/order-confirmation/${result.data.orderNumber}`)
      } else {
        toast.error(result.message || 'Failed to place order')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <Card>
        <CardHeader>
          <CardTitle>Checkout Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Customer Information</h3>

                <FormField
                  control={form.control}
                  name="customerInfo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerInfo.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerInfo.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Shipping Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Shipping Address</h3>

                <FormField
                  control={form.control}
                  name="shippingAddress.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingAddress.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingAddress.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shippingAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Address</h3>

                <FormField
                  control={form.control}
                  name="billingAddress.sameAsShipping"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Same as shipping address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {!sameAsShipping && (
                  <>
                    <FormField
                      control={form.control}
                      name="billingAddress.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingAddress.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billingAddress.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium">{item.productTitle}</h4>
                {item.selectedVariant.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {item.selectedVariant.map((variant, index) => (
                      <span key={index}>
                        {variant.variantName}: {variant.variantValue}
                        {index < item.selectedVariant.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total ({cart.totalItems} items)</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
