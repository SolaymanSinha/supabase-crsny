import { Product, VariantName } from '@/payload-types'

type Variants = NonNullable<Product['variants']>
type TVariantName = NonNullable<VariantName>
type VariantOptions = NonNullable<Variants[number]['options']>

export function isVariantsExist(variant: Product['variants']): variant is Variants {
  if (variant !== null && variant !== undefined) {
    variant
    return true
  }
  return false
}

export function isVariantNameExist(
  variantName: number | VariantName | null | undefined,
): variantName is TVariantName {
  if (variantName !== null && variantName !== undefined && typeof variantName === 'object') {
    return true
  }
  return false
}

export function isVariantOptionExist(variantOptions: unknown): variantOptions is VariantOptions {
  // Checking if the object has the variantName property
  if (
    variantOptions !== null &&
    variantOptions !== undefined &&
    typeof variantOptions === 'object' &&
    'variantName' in variantOptions
  ) {
    return true
  }
  return false
}
