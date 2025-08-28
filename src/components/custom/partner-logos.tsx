import { cn } from '@/lib/utils'
import { Media } from '@/payload-types'
import Image from 'next/image'
import Marquee from 'react-fast-marquee'
import SectionHeading from './section-heading'

export const PartnerLogos = ({ className, images }: { className?: string; images: Media[] }) => {
  return (
    <div
      className={cn(
        'relative w-full',
        className,
        'relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12',
      )}
    >
      {/* Main Heading */}
      <SectionHeading>Online Partners</SectionHeading>

      {/* Partner Logos Container */}
      <LogoContainer images={images} />
    </div>
  )
}

const LogoContainer = ({ images }: { images: Media[] }) => {
  return (
    <div className="relative">
      <Marquee speed={30} gradient={false} pauseOnHover={true} className="py-4">
        {images.map((logo, index) => (
          <LogoItem key={`${logo.id}-${index}`} logo={logo} />
        ))}
      </Marquee>
    </div>
  )
}

const LogoItem = ({ logo }: { logo: Media }) => {
  return (
    <div
      className={cn(
        'h-[76px] flex-shrink-0 flex items-center justify-center mx-10 px-4 rounded-lg w-56 aspect-auto',
      )}
    >
      {logo?.url ? (
        <div className="relative w-full h-full p-2">
          <Image
            src={logo.url}
            alt={logo.alt}
            fill
            className="object-contain"
            sizes="(max-width: 500px) 100vw, 500px"
          />
        </div>
      ) : (
        <span className="text-gray-500 text-sm">{logo.alt}</span>
      )}
    </div>
  )
}
