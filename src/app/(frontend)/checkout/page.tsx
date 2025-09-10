import { CheckoutForm } from '@/components/forms/checkout'
import { getCompany } from '@/functions/company.function'
import { generateSEOMetadata } from '@/lib/utils/seo'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const company = await getCompany()
    return generateSEOMetadata(
      { title: 'Checkout', description: 'Place your order', noIndex: true },
      company.data,
    )
  } catch (error) {
    console.error('Error generating Checkout page metadata:', error)
    return {
      title: 'Checkout',
      description: 'Place your order',
    }
  }
}

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
