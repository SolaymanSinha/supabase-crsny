import React from 'react'
import { H1 } from '../ui/h1'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Category } from '@/payload-types'
import Image from 'next/image'
import { fallbackImageURL, getFullURL } from '@/lib/utils/url'

const ExploreCategories = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Title */}

      <H1 className="text-left mb-5">Explore All Categories</H1>

      {/* Categories Carousel */}
      <div className="relative">
        <Carousel
          opts={{
            align: 'start',
            loop: false,
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 sm:-ml-4">
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="pl-2 sm:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <a className="group cursor-pointer block" href={`/categories/${category.slug}`}>
                  {/* Category Image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-3 sm:mb-4">
                    {category.image ? (
                      <Image
                        src={
                          (typeof category.image === 'object' &&
                            getFullURL(category?.image?.url)) ||
                          fallbackImageURL({})
                        }
                        width={100}
                        height={100}
                        alt={category.name}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center" />
                    )}
                  </div>

                  {/* Category Name */}
                  <div className="text-center">
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-black leading-tight">
                      {category.name}
                    </p>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="sr-only">Previous</span>
          </CarouselPrevious>

          <CarouselNext className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50">
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
            <span className="sr-only">Next</span>
          </CarouselNext>
        </Carousel>
      </div>
    </div>
  )
}

export default ExploreCategories
