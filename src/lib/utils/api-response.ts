// lib/api-response.ts

import { AppError } from './errors'

// Interface for standardized API response with meta field
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  message: string
  statusCode: number
  meta?: Record<string, unknown>
}

// Utility class to create consistent API responses
export class ApiResponseBuilder {
  static success<T>(
    data: T,
    message: string = 'Request successful',
    statusCode: number = 200,
    meta?: Record<string, unknown>,
  ): ApiResponse<T> {
    return {
      success: true,
      data,
      message,
      statusCode,
      meta,
    }
  }

  static error(
    code: string,
    message: string,
    statusCode: number = 400,
    details?: unknown,
  ): ApiResponse<never> {
    return {
      success: false,
      error: { code, message, details },
      message,
      statusCode,
    }
  }

  static unknownError(
    details?: unknown,
    code: string = 'UNKNOWN_ERROR',
    message: string = 'An unexpected error occurred',
    statusCode: number = 500,
  ): ApiResponse<never> {
    return {
      success: false,
      error: { code, message, details },
      message,
      statusCode,
    }
  }

  static fromError(error: AppError): ApiResponse<never> {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      message: error.message,
      statusCode: error.statusCode,
    }
  }
}
