// lib/logger.ts
import pino, { Logger } from 'pino'

const isBrowser = typeof window !== 'undefined'
const isBuild = process.env.NEXT_BUILD === 'true' // Custom flag

const createPinoConfig = (environment: string = 'development') => ({
  name: 'nextjs-app',
  level: environment === 'production' ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  ...(isBrowser
    ? { browser: { asObject: true } }
    : environment !== 'production' && !isBuild
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true },
          },
        }
      : {}),
})

export const logger: Logger = isBuild
  ? pino({ enabled: false })
  : pino(createPinoConfig(process.env.NODE_ENV))

export const logToServer = async (log: any) => {
  if (isBrowser && process.env.NODE_ENV === 'production' && !isBuild) {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      })
    } catch (error) {
      console.error('Failed to send log to server:', error)
    }
  }
}
