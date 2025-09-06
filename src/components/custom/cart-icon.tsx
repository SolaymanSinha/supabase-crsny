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
      <Button variant="outline" size="sm" className="relative">
        <ShoppingCart className="w-4 h-4" />
        {cartTotals.totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartTotals.totalItems}
          </span>
        )}
        <span className="ml-2">Cart</span>
      </Button>
    </Link>
  )
}
