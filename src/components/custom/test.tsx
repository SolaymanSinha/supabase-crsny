'use client'
import { logger } from '@/lib/utils/logger'
import React from 'react'

const Test = () => {
  logger.info('Hello From Client Component')
  return <div>Hola!</div>
}

export default Test
