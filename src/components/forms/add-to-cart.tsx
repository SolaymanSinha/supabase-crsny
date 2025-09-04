'use client'

import { Product } from '@/payload-types'
import { isVariantOptionExist, isVariantsExist } from '@/type-checker/variant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import React from 'react'
import { isDefined } from '@/type-checker/global'

const formSchema = z.object({
  variant: z.array(
    z.object({
      variantName: z.string(),
      variantValue: z.string(),
    }),
  ),
  quantity: z.number(),
})

export const AddToCartForm = ({ product }: { product: Product }) => {
  const { variants } = product
  console.log(variants)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variant: [],
      quantity: 1,
    },
  })

  const { fields: variantFields } = useFieldArray({
    control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
    name: 'variant', // unique name for your Field Array
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  React.useEffect(() => {
    if (
      variants &&
      variants.every(
        (variant) =>
          Array.isArray(variant.options) &&
          variant.options.every(
            (option) =>
              typeof option.variantName === 'string' && typeof option.variantValue === 'string',
          ),
      )
    ) {
      // ✅ safe to use variants here
      variants
    }
  }, [variants, form])

  return (
    <div>
      {/* {variantFields.map((variant, index) => {
        return <div>Sinha</div>
      })} */}

      {variantFields.map((field, index) => (
        <input
          key={field.id} // important to include key with field's id
          {...form.register(`variant.${index}.variantName`)}
        />
      ))}
    </div>
  )
}
