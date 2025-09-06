'use client'
import { Media, Product } from '@/payload-types'
import React from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import { AddToCartForm } from '../forms/add-to-cart'
import AddToCart2 from '../forms/add-to-cart-2'

interface ReactImageGalleryType {
  original: string
  thumbnail: string
}

const ProductDetails = ({ product }: { product: Product }) => {
  const [productPrice, setProductPrice] = React.useState(product?.basePrice)

  const { coverImage, previewImages, shortDescription, category, title } = product
  const allImages = [coverImage, ...(previewImages || [])]

  const getReactImageGallery = (images: Media[]) => {
    if (!images) return []
    return images.map((image) => ({
      original: image?.url || '',
      thumbnail: image?.url || '',
    }))
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Media */}
        <div>
          <ImageGallery
            autoPlay={true}
            showPlayButton={false}
            showFullscreenButton={false}
            showNav={false}
            showThumbnails={true}
            showBullets={false}
            items={getReactImageGallery(
              (allImages.every((image) => typeof image === 'object' && image !== null) &&
                allImages) ||
              [],
            )}
          />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl font-semibold uppercase text-black">{title}</h1>

          {category && (
            <p className="text-black/70 text-sm md:text-base">
              <span className="font-medium">Category: </span>
              <span>{typeof category === 'object' ? category.name : 'N/A'}</span>
            </p>
          )}

          {shortDescription && (
            <div
              className="text-black/70 leading-7 md:leading-7 text-base md:text-lg max-w-2xl"
              dangerouslySetInnerHTML={{
                __html: shortDescription.replace(/\n/g, '<br />') || '',
              }}
            ></div>
          )}

          <div className="flex items-center gap-2">
            <div className="text-2xl font-medium text-[#ffc107]">${productPrice.toFixed(2)}</div>
          </div>

          {/* <AddToCartForm product={product} /> */}
          <AddToCart2 product={product} />
        </div>
      </div>
    </section>
  )
}

export default ProductDetails
