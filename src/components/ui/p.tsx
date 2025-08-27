import { cn } from '@/lib/utils'
import React from 'react'

export const P = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h4 className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}>{children}</h4>
}
