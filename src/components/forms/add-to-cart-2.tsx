'use client'
import { Product } from '@/payload-types'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    console.log('Variants Length: ', tuppledVariants.length)

    if (!variants || selectedVariant.length < tuppledVariants.length) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
        {tuppledVariants.map((variant, index) => {
          return (
            <Select
              key={index}
              onValueChange={(value: string) => handleVariantChange(index, variant[0], value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={`Select ${variant[0]}`} />
              </SelectTrigger>
              <SelectContent className="w-full">
                {variant[1].map((value) => {
                  return (
                    <SelectItem className="w-full" key={value} value={value}>
                      {value}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        })}
      </div>

      <Button
        className="mt-5 w-full bg-yellow-500"
        disabled={validVariant === null ? true : false}
        type="submit"
      >
        Add To Cart
      </Button>
    </form>
  )
}

// Schema for shadcn Form
// const formSchema = z.object({
//   selectedVariant: z.array(
//     z.object({
//       variantName: z.string().min(1, 'Variant name is required'),
//       variantValue: z.string().min(1, 'Please select a variant option'),
//     }),
//   ),
//   quantity: z.number().min(1, 'Quantity must be at least 1'),
//   uploadedFiles: z
//     .array(
//       z.object({
//         fieldLabel: z.string(),
//         files: z.array(z.instanceof(File)),
//       }),
//     )
//     .optional(),
// })

// // Type for form to consume
// type FormData = z.infer<typeof formSchema>

export default AddToCart2
