import { NextRequest, NextResponse } from 'next/server'
import { getPayloadInstance } from '@/lib/utils/getPayload'
import { z } from 'zod'

const uploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, 'At least one file is required'),
  fieldLabel: z.string().min(1, 'Field label is required'),
})

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadInstance()
    const formData = await request.formData()

    // Extract field label
    const fieldLabel = formData.get('fieldLabel') as string
    if (!fieldLabel) {
      return NextResponse.json(
        { success: false, error: 'Field label is required' },
        { status: 400 },
      )
    }

    // Extract files
    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files provided' }, { status: 400 })
    }

    // Validate files
    const maxFileSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]

    for (const file of files) {
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { success: false, error: `File ${file.name} exceeds 10MB limit` },
          { status: 400 },
        )
      }

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: `File type ${file.type} not allowed for ${file.name}` },
          { status: 400 },
        )
      }
    }

    // Upload files to Payload CMS
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          const result = await payload.create({
            collection: 'media',
            data: {
              alt: `${fieldLabel} - ${file.name}`,
            },
            file: {
              data: buffer,
              mimetype: file.type,
              name: file.name,
              size: file.size,
            },
          })

          return {
            id: result.id,
            url: result.url,
            filename: result.filename,
            mimeType: result.mimeType,
            filesize: result.filesize,
            alt: result.alt,
          }
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error)
          throw new Error(`Failed to upload ${file.name}`)
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: {
        fieldLabel,
        uploadedFiles: uploadedMedia,
      },
    })
  } catch (error: any) {
    console.error('File upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error during file upload',
      },
      { status: 500 },
    )
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
