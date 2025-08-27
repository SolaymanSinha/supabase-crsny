// app/api/log/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/utils/logger' // Adjust path as needed

export async function POST(req: NextRequest) {
  const logData = await req.json()
  logger.info('Client log received', logData) // Or use appropriate level
  return NextResponse.json({ status: 'success' })
}
