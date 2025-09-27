'use client'

import React from 'react'
import { useAtom } from 'jotai'
import { cartTotalsAtom } from '@/lib/atoms/cart'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const CartIcon = () => {
  const [cartTotals] = useAtom(cartTotalsAtom)

  return (
    <Link href="/cart">
      <Button
        variant="outline"
        size="sm"
        className="relative bg-transparent hover:bg-yellow-50 hover:border-yellow-500 transition-colors"
      >
        <ShoppingCart className="w-4 h-4" />
        {cartTotals.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
            {cartTotals.totalItems > 99 ? '99+' : cartTotals.totalItems}
          </span>
        )}
        <span className="ml-2 hidden sm:inline">Cart</span>
      </Button>
    </Link>
  )
}
