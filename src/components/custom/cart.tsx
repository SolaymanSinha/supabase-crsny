'use client'

import React from 'react'
import { useAtom } from 'jotai'
import {
  cartAtom,
  removeFromCartAtom,
  updateCartItemQuantityAtom,
  clearCartAtom,
} from '@/lib/atoms/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export const Cart = () => {
  const [cart] = useAtom(cartAtom)
  const [, removeFromCart] = useAtom(removeFromCartAtom)
  const [, updateQuantity] = useAtom(updateCartItemQuantityAtom)
  const [, clearCart] = useAtom(clearCartAtom)

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId)
    toast.success('Item removed from cart')
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }
    updateQuantity({ itemId, quantity: newQuantity })
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  if (cart.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Cart ({cart.totalItems} items)</CardTitle>
        <Button variant="outline" size="sm" onClick={handleClearCart}>
          Clear Cart
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            {/* Product Image */}
            {item.coverImage?.url && (
              <img
                src={item.coverImage.url}
                alt={item.coverImage.alt || item.productTitle}
                className="w-16 h-16 object-cover rounded"
              />
            )}

            {/* Product Details */}
            <div className="flex-1">
              <h4 className="font-medium">{item.productTitle}</h4>

              {/* Variant Details */}
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

              {/* Upload Files */}
              {item.uploadedFiles && item.uploadedFiles.length > 0 && (
                <div className="text-sm text-gray-600">
                  {item.uploadedFiles.map((upload, index) => (
                    <div key={index}>
                      {upload.fieldLabel}: {upload.files.length} file(s)
                    </div>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-600">${item.price.toFixed(2)} each</div>
              <div className="font-medium text-lg">${(item.price * item.quantity).toFixed(2)}</div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value, 10) || 1
                  handleUpdateQuantity(item.id, newQuantity)
                }}
                className="w-16 text-center"
                min={1}
              />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Remove Button */}
            <Button variant="destructive" size="sm" onClick={() => handleRemoveItem(item.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex justify-between items-center w-full text-lg font-bold">
          <span>Total: ${cart.totalPrice.toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="w-full">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
