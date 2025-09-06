import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export interface CartVariantOption {
  variantName: string
  variantValue: string
}

export interface CartItem {
  id: string
  productId: string
  productTitle: string
  productSlug: string
  coverImage?: {
    id: string
    url?: string
    alt?: string
  }
  selectedVariant: CartVariantOption[]
  price: number
  quantity: number
  uploadedFiles?: {
    fieldLabel: string
    files: File[]
  }[]
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

// Persistent cart state using localStorage
export const cartAtom = atomWithStorage<Cart>('cart', {
  items: [],
  totalItems: 0,
  totalPrice: 0,
})

// Derived atom for cart totals
export const cartTotalsAtom = atom((get) => {
  const cart = get(cartAtom)
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    totalItems,
    totalPrice,
  }
})

// Action to add item to cart
export const addToCartAtom = atom(null, (get, set, newItem: Omit<CartItem, 'id'>) => {
  const cart = get(cartAtom)

  // Generate unique ID for cart item based on product and variant
  const variantKey = newItem.selectedVariant
    .map((v) => `${v.variantName}:${v.variantValue}`)
    .sort()
    .join('|')
  const itemId = `${newItem.productId}_${variantKey}`

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex((item) => item.id === itemId)

  let updatedItems: CartItem[]

  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    updatedItems = cart.items.map((item, index) =>
      index === existingItemIndex ? { ...item, quantity: item.quantity + newItem.quantity } : item,
    )
  } else {
    // Add new item to cart
    const cartItem: CartItem = {
      ...newItem,
      id: itemId,
    }
    updatedItems = [...cart.items, cartItem]
  }

  // Calculate new totals
  const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  set(cartAtom, {
    items: updatedItems,
    totalItems,
    totalPrice,
  })
})

// Action to remove item from cart
export const removeFromCartAtom = atom(null, (get, set, itemId: string) => {
  const cart = get(cartAtom)
  const updatedItems = cart.items.filter((item) => item.id !== itemId)

  const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  set(cartAtom, {
    items: updatedItems,
    totalItems,
    totalPrice,
  })
})

// Action to update item quantity
export const updateCartItemQuantityAtom = atom(
  null,
  (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
    const cart = get(cartAtom)

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      set(removeFromCartAtom, itemId)
      return
    }

    const updatedItems = cart.items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item,
    )

    const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    set(cartAtom, {
      items: updatedItems,
      totalItems,
      totalPrice,
    })
  },
)

// Action to clear cart
export const clearCartAtom = atom(null, (get, set) => {
  set(cartAtom, {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  })
})

