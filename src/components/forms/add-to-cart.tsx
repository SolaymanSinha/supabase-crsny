'use client'

import { Product, Media } from '@/payload-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import React from 'react'
import { useAtom } from 'jotai'
import { addToCartAtom, CartItem } from '@/lib/atoms/cart'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

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

type FormData = z.infer<typeof formSchema>

export const AddToCartForm = ({ product }: { product: Product }) => {
  const [, addToCart] = useAtom(addToCartAtom)
  const [selectedPrice, setSelectedPrice] = React.useState(product.basePrice)
  const [isValidVariant, setIsValidVariant] = React.useState(false)

  // Get unique variant names from all variants
  const getUniqueVariantNames = () => {
    if (!product.variants) return []
    const variantNames = new Set<string>()

    product.variants.forEach((variant) => {
      variant.options?.forEach((option) => {
        if (option.variantName) {
          variantNames.add(option.variantName)
        }
      })
    })

    return Array.from(variantNames)
  }

  // Get variant values for a specific variant name
  const getVariantValues = (variantName: string) => {
    if (!product.variants) return []
    const values = new Set<string>()

    product.variants.forEach((variant) => {
      variant.options?.forEach((option) => {
        if (option.variantName === variantName && option.variantValue) {
          values.add(option.variantValue)
        }
      })
    })

    return Array.from(values)
  }

  // Find matching variant and update price
  const findMatchingVariant = (selectedVariant: FormData['selectedVariant']) => {
    if (!product.variants || selectedVariant.length === 0) {
      setSelectedPrice(product.basePrice)
      setIsValidVariant(true)
      return
    }

    // Check if all variant options are selected
    const hasCompleteSelection = selectedVariant.every(
      (variant) => variant.variantName && variant.variantValue,
    )

    if (!hasCompleteSelection) {
      setSelectedPrice(product.basePrice)
      setIsValidVariant(true)
      return
    }

    // Find exact matching variant
    const matchingVariant = product.variants.find((variant) => {
      if (!variant.options || variant.options.length !== selectedVariant.length) {
        return false
      }

      return selectedVariant.every((selected) =>
        variant.options?.some(
          (option) =>
            option.variantName === selected.variantName &&
            option.variantValue === selected.variantValue,
        ),
      )
    })

    if (matchingVariant) {
      setSelectedPrice(matchingVariant.price)
      setIsValidVariant(true)
    } else {
      setSelectedPrice(product.basePrice)
      setIsValidVariant(false)
    }
  }

  const uniqueVariantNames = getUniqueVariantNames()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedVariant: uniqueVariantNames.map((name) => ({
        variantName: name,
        variantValue: '',
      })),
      quantity: 1,
      uploadedFiles: [],
    },
  })

  const watchedVariant = form.watch('selectedVariant')
  const watchedQuantity = form.watch('quantity')

  // Update price when variant changes
  React.useEffect(() => {
    findMatchingVariant(watchedVariant)
  }, [watchedVariant])

  const totalPrice = selectedPrice * (watchedQuantity || 1)

  const onSubmit = async (values: FormData) => {
    try {
      const cartItem: Omit<CartItem, 'id'> = {
        productId: String(product.id),
        productTitle: product.title,
        productSlug: product.slug,
        coverImage: product.coverImage
          ? {
              id: String((product.coverImage as Media).id),
              url: (product.coverImage as Media).url || undefined,
              alt: (product.coverImage as Media).alt,
            }
          : undefined,
        selectedVariant: values.selectedVariant,
        price: selectedPrice,
        quantity: values.quantity,
        uploadedFiles: values.uploadedFiles,
      }

      addToCart(cartItem)
      toast.success('Product added to cart!')
      form.reset()
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add product to cart')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Variant Selection */}
        {uniqueVariantNames.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Options</h3>
            {uniqueVariantNames.map((variantName, index) => (
              <FormField
                key={variantName}
                control={form.control}
                name={`selectedVariant.${index}.variantValue`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">{variantName}</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        form.setValue(`selectedVariant.${index}.variantName`, variantName)
                        form.setValue(`selectedVariant.${index}.variantValue`, value)
                        field.onChange(value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${variantName}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getVariantValues(variantName).map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}

        {/* Upload Fields */}
        {product.uploadFields && product.uploadFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Files</h3>
            {product.uploadFields.map((uploadField, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`uploadedFiles.${index}.fieldLabel`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {uploadField.label}
                      {uploadField.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    {uploadField.description && (
                      <p className="text-sm text-gray-600">{uploadField.description}</p>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        multiple={(uploadField.maxFiles || 1) > 1}
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          form.setValue(`uploadedFiles.${index}`, {
                            fieldLabel: uploadField.label,
                            files: files.slice(0, uploadField.maxFiles || 1),
                          })
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}

        {/* Quantity */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Display */}
        <div
          className={`space-y-2 p-4 rounded-lg ${!isValidVariant ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}
        >
          {!isValidVariant && (
            <div className="text-sm text-red-600 font-medium">
              ⚠️ This variant combination is not available
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Unit Price:
              {selectedPrice !== product.basePrice && isValidVariant && (
                <span className="ml-1 text-xs text-blue-600">(variant price)</span>
              )}
            </span>
            <div className="text-right">
              {selectedPrice !== product.basePrice && isValidVariant && (
                <div className="text-xs text-gray-400 line-through">
                  ${selectedPrice.toFixed(2)}
                </div>
              )}
              <span className="text-lg font-semibold">${selectedPrice.toFixed(2)}</span>
            </div>
          </div>
          {watchedQuantity > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Quantity:</span>
              <span className="text-sm">{watchedQuantity}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t pt-2">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!isValidVariant}>
          {!isValidVariant ? 'Variant Combination Not Available' : 'Add to Cart'}
        </Button>
      </form>
    </Form>
  )
}
