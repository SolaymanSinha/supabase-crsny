'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SectionHeading from './section-heading'

export default function Newsletter() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center">
      <div className="inline-block scale-90 md:scale-95">
        <SectionHeading>Subscribe to our newsletter</SectionHeading>
      </div>

      <p className="mx-auto max-w-2xl text-center text-sm md:text-base text-black/70">
        Professional printing services can provide you with high-quality prints that will look great
        and last a long time. We have the equipment and expertise.
      </p>

      <form className="mt-6 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email"
            className="h-10 md:h-11 w-full sm:w-[320px] rounded-md border border-black/15 bg-white text-sm md:text-base placeholder:text-black/50"
          />
          <Button
            type="submit"
            className="h-10 md:h-11 rounded-md bg-[#ffc107] px-5 md:px-6 text-sm md:text-base font-medium text-black hover:bg-[#ffc107]/90"
          >
            Subscribe Now
          </Button>
        </div>
      </form>
    </div>
  )
}
