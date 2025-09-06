'use client'
import { Product } from '@/payload-types'
import React, { useEffect } from 'react'
import z from 'zod'

/*
 * INFO: User can add-to-cart if variant isn't available (base price) or selected variant is a valid variant
 */

const AddToCart2 = ({ product }: { product: Product }) => {
  const { variants } = product

  const [selectedVariants, setSelectedVariants] = React.useState<
    { variantName: string; variantValue: string }[]
  >([])

  const [validVariant, setValidVariant] = React.useState<
    NonNullable<Product['variants']>[number] | null
  >(null)

  // INFO: Handling the logic for add-to-cart
  const [isValid, setIsValid] = React.useState<boolean>(false)
  useEffect(() => {
    if (variants) {
      // Variant is available. So, user can't add-to-cart without selecting the variant
      setIsValid(false)
    } else {
      setIsValid(true)
    }
  }, [])

  const optionMap: Record<string, Set<string>> = {}

  // INFO: Transforming variants into usable object. Pattern: {Color: Set(["Red", "Green"])}
  variants?.forEach((variant) => {
    variant.options?.forEach((option) => {
      if (option.variantName && !optionMap[option.variantName]) {
        optionMap[option.variantName] = new Set()
      }
      if (option.variantName && option.variantValue) {
        optionMap[option.variantName].add(option.variantValue)
      }
    })
  })

  // INFO: Transforming object variants into tupple. It will be used in the frontend code
  const tuppledVariants: [string, string[]][] = Object.entries(optionMap).map(([name, values]) => [
    name,
    Array.from(values),
  ])

  // INFO: See the transformed object + transformed tuppled variants

  // INFO: This function is handling the variant chnage by user
  const handleVariantChange = (index: number, name: string, value: string) => {
    const updated = [...selectedVariants]
    updated[index] = { variantName: name, variantValue: value }
    setSelectedVariants(updated)

    // console.log('Updated Variant: ', selectedVariants)
  }

  // INFO: Checking variant exists or not
  function findMatchingVariant(
    variants: Product['variants'],
    selectedVariant: { variantName: string; variantValue: string }[],
  ) {
    console.log('Variants:', variants)
    console.log('Selected:', selectedVariant)

    if (!variants || selectedVariant.length <= 1) {
      return null // nothing selected, no match
    }

    return variants.find((variant) =>
      selectedVariant.every((sel) =>
        variant.options?.some(
          (opt) => opt?.variantName === sel?.variantName && opt?.variantValue === sel?.variantValue,
        ),
      ),
    )
  }

  useEffect(() => {
    const result = findMatchingVariant(variants, selectedVariants)

    if (result) {
      setValidVariant(result)
    } else {
      setValidVariant(null)
    }
  }, [selectedVariants])

  // React’s setState (useState) is asynchronous, So, use useEffect() to monitor and log the latest value
  useEffect(() => {
    console.log('Valid Variant', validVariant)

    console.log('Selected Variant', selectedVariants)
  }, [validVariant, selectedVariants])

  return (
    <form>
      {tuppledVariants.map((variant, index) => {
        return (
          <select
            defaultValue="Select variant"
            key={variant[0]}
            name={variant[0]}
            onChange={(e) => handleVariantChange(index, variant[0], e.target.value)}
          >
            {variant[1].map((value) => {
              return (
                <option key={value} value={value}>
                  {value}
                </option>
              )
            })}
          </select>
        )
      })}

      {validVariant ? 'Sinha' : 'Not Sinha'}
    </form>
  )
}

// Schema for shadcn Form
const formSchema = z.object({
  selectedVariant: z.array(
    z.object({
      variantName: z.string().min(1, 'Variant name is required'),
      variantValue: z.string().min(1, 'Please select a variant option'),
    }),
  ),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  uploadedFiles: z
    .array(
      z.object({
        fieldLabel: z.string(),
        files: z.array(z.instanceof(File)),
      }),
    )
    .optional(),
})

// Type for form to consume
type FormData = z.infer<typeof formSchema>

export default AddToCart2
