'use server'
import { WebContentController } from '@/controllers/webContent.controller'
import { WEB_CONTENT_CONTROLLER_TOKEN } from '@/lib/constants/di-tokens/webContent'
import { ApiResponse } from '@/lib/utils/api-response'
import { container } from '@/lib/utils/di-container'
import { WebContent } from '@/payload-types'

const webContentController = container.resolve<WebContentController>(WEB_CONTENT_CONTROLLER_TOKEN)

export async function getWebContent(): Promise<ApiResponse<WebContent>> {
  return await webContentController.getWebContent()
}
