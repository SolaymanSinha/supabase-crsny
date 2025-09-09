'use client'
import { Media, Product } from '@/payload-types'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addToCartAtom, CartItem, CartUploadField, UploadedFileData } from '@/lib/atoms/cart'
import { FileUpload, UploadedFile } from '@/components/ui/file-upload'
import { toast } from 'sonner'
import { useAtom } from 'jotai'

/*
 * INFO: User can add-to-cart if variant isn't available (base price) or selected variant is a valid variant
 */

const AddToCart2 = ({
  product,
  productPrice,
  setProductPrice,
}: {
  product: Product
  productPrice: number
  setProductPrice: (price: number) => void
}) => {
  const { variants, basePrice, uploadFields } = product

  const [, addToCart] = useAtom(addToCartAtom)

  // State for uploaded files organized by upload field (temporary before upload)
  const [pendingFiles, setPendingFiles] = useState<Record<string, UploadedFile[]>>({})
  // State for successfully uploaded files with their CMS IDs
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileData[]>>({})
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({})

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
      setProductPrice(result?.price ?? basePrice)
    } else {
      setValidVariant(null)
    }
  }, [selectedVariants])

  // React’s setState (useState) is asynchronous, So, use useEffect() to monitor and log the latest value
  useEffect(() => {
    console.log('Valid Variant', validVariant)
    console.log('Selected Variant', selectedVariants)
  }, [validVariant, selectedVariants])

  // Handle file upload for a specific field - upload immediately to CMS
  const handleFileUpload = async (fieldLabel: string, files: UploadedFile[]) => {
    // Store pending files temporarily
    setPendingFiles((prev) => ({
      ...prev,
      [fieldLabel]: files,
    }))

    // Clear any previous error for this field
    setUploadErrors((prev) => ({
      ...prev,
      [fieldLabel]: '',
    }))

    if (files.length === 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [fieldLabel]: [],
      }))
      return
    }

    // Start uploading
    setIsUploading((prev) => ({ ...prev, [fieldLabel]: true }))

    try {
      // Upload files directly using fetch
      const uploadedFileData: UploadedFileData[] = []

      for (const fileToUpload of files) {
        const formData = new FormData()
        formData.append('fieldLabel', fieldLabel)
        formData.append('file_0', fileToUpload.file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Upload failed')
        }

        // Add uploaded file info to the array
        result.data.uploadedFiles.forEach((file: any) => {
          uploadedFileData.push({
            id: file.id,
            filename: file.filename || 'Unknown',
            url: file.url,
            mimeType: file.mimeType,
            filesize: file.filesize,
          })
        })
      }

      setUploadedFiles((prev) => ({
        ...prev,
        [fieldLabel]: uploadedFileData,
      }))

      toast.success(`${uploadedFileData.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error(`Error uploading files for ${fieldLabel}:`, error)
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadErrors((prev) => ({
        ...prev,
        [fieldLabel]: errorMessage,
      }))
      toast.error(`Upload failed: ${errorMessage}`)
    } finally {
      setIsUploading((prev) => ({ ...prev, [fieldLabel]: false }))
    }
  }

  // Validate upload fields before adding to cart
  const validateUploadFields = (): boolean => {
    if (!uploadFields || uploadFields.length === 0) return true

    const errors: Record<string, string> = {}
    let isValid = true

    uploadFields.forEach((field) => {
      const fieldFiles = uploadedFiles[field.label] || []
      const isCurrentlyUploading = isUploading[field.label]

      if (isCurrentlyUploading) {
        errors[field.label] = `${field.label} is still uploading, please wait`
        isValid = false
      } else if (field.required && fieldFiles.length === 0) {
        errors[field.label] = `${field.label} is required`
        isValid = false
      } else if (fieldFiles.length > (field.maxFiles || 1)) {
        errors[field.label] = `Maximum ${field.maxFiles || 1} file(s) allowed for ${field.label}`
        isValid = false
      }
    })

    setUploadErrors(errors)
    return isValid
  }

  // Convert uploaded files to CartUploadField format for cart storage
  const prepareUploadedFiles = (): CartUploadField[] => {
    if (!uploadFields || uploadFields.length === 0) return []

    return uploadFields.map((field) => {
      const fieldFiles = uploadedFiles[field.label] || []

      return {
        fieldLabel: field.label,
        required: field.required || false,
        maxFiles: field.maxFiles || 1,
        files: fieldFiles, // These are already UploadedFileData with CMS IDs
      }
    })
  }

  const handleAddToCart = (e: any) => {
    e.preventDefault()

    // Validate upload fields first
    if (!validateUploadFields()) {
      toast.error('Please fix upload field errors before adding to cart')
      return
    }

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
        selectedVariant: selectedVariants,
        price: productPrice,
        quantity: 1,
        uploadedFiles: prepareUploadedFiles(),
      }

      addToCart(cartItem)

      // Note: We don't clear uploaded files since they're already in CMS and referenced by ID
      toast.success('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add product to cart')
    }
  }

  return (
    <form onSubmit={(e) => handleAddToCart(e)}>
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

      {/* File Upload Fields */}
      {uploadFields && uploadFields.length > 0 && (
        <div className="space-y-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900">Upload Files</h3>
          {uploadFields.map((field, index) => (
            <div key={index} className="space-y-2">
              <FileUpload
                label={field.label}
                description={field.description || undefined}
                required={field.required || false}
                maxFiles={field.maxFiles || 1}
                maxFileSize={4} // 4MB limit for Vercel
                files={pendingFiles[field.label] || []}
                onFilesChange={(files) => handleFileUpload(field.label, files)}
                error={uploadErrors[field.label]}
              />
              {isUploading[field.label] && (
                <p className="text-sm text-yellow-600">Uploading files...</p>
              )}
              {uploadedFiles[field.label] && uploadedFiles[field.label].length > 0 && (
                <div className="text-sm text-green-600">
                  ✅ {uploadedFiles[field.label].length} file(s) uploaded successfully
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* INFO: If variant exists then disable/enable the buttton based on valid variant */}
      {tuppledVariants.length > 0 && (
        <Button
          type="submit"
          className="mt-5 w-full bg-yellow-500"
          disabled={validVariant === null ? true : false}
        >
          Add To Cart
        </Button>
      )}

      {/* INFO: If variant doesn't exists than the button is always enabled */}
      {tuppledVariants.length === 0 && (
        <Button type="submit" className="mt-5 w-full bg-yellow-500">
          Add To Cart
        </Button>
      )}
    </form>
  )
}

// Schema fora shadcn Form
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
