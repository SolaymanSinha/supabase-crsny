import { cn } from '@/lib/utils'
import React from 'react'

export const H3 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}>
      {children}
    </h3>
  )
}
