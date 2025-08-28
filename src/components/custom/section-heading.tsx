import React from 'react'
import { H1 } from '../ui/h1'
import { cn } from '@/lib/utils'

const SectionHeading = ({ children, className }: { children: string; className?: string }) => {
  return (
    <H1 className={cn('text-4xl md:text-5xl font-bold text-black mb-8 text-left', className)}>
      {children}
    </H1>
  )
}

export default SectionHeading
