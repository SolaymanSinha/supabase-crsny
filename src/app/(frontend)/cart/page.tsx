import { Cart } from '@/components/custom/cart'
import { getCompany } from '@/functions/company.function'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const company = await getCompany()
    return generateSEOMetadata(
      { title: 'Cart', description: 'Explore your shopping cart', noIndex: true },
      company.data,
    )
  } catch (error) {
    console.error('Error generating Cart page metadata:', error)
    return {
      title: 'Cart',
      description: 'Explore your shopping cart',
    }
  }
}

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <Cart />
    </div>
  )
}
