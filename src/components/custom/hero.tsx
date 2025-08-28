import React from 'react'
import { WebContent } from '@/payload-types'
import Image from 'next/image'
import { fallbackImageURL, getFullURL } from '@/lib/utils/url'

const Hero = ({ heroImage }: { heroImage: WebContent['heroImage'] }) => {
  return (
    <div className="relative w-full overflow-hidden">
      <div>
        <Image
          src={
            (typeof heroImage === 'object' && getFullURL(heroImage?.url)) ||
            fallbackImageURL({ width: 1920, height: 1080 })
          }
          alt="Hero Image"
          width={1920}
          height={1080}
          className="w-full h-fit"
        />
      </div>
    </div>
  )
}

export default Hero
