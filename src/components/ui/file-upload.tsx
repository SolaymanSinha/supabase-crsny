'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X, Upload, File, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

export interface UploadedFile {
  file: File
  preview?: string
  id: string
}

interface FileUploadProps {
  label: string
  description?: string
  required?: boolean
  maxFiles?: number
  maxFileSize?: number // in MB
  acceptedFileTypes?: string[]
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  error?: string
}

const DEFAULT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export function FileUpload({
  label,
  description,
  required = false,
  maxFiles = 5,
  maxFileSize = 10, // 10MB default
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  files,
  onFilesChange,
  error,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((rejection) => {
          const { file, errors } = rejection
          const errorMessages = errors.map((e: any) => {
            switch (e.code) {
              case 'file-too-large':
                return `File too large (max ${maxFileSize}MB)`
              case 'file-invalid-type':
                return 'File type not supported'
              case 'too-many-files':
                return `Too many files (max ${maxFiles})`
              default:
                return e.message
            }
          })
          return `${file.name}: ${errorMessages.join(', ')}`
        })
        toast.error(`File upload failed:\n${errors.join('\n')}`)
        return
      }

      // Check total file count
      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`)
        return
      }

      // Additional validation for accepted files
      const validFiles: File[] = []
      const invalidFiles: string[] = []

      acceptedFiles.forEach((file) => {
        // Double-check file size (browser validation might be different)
        if (file.size > maxFileSize * 1024 * 1024) {
          invalidFiles.push(`${file.name}: File too large (max ${maxFileSize}MB)`)
          return
        }

        // Check file type again
        if (!acceptedFileTypes.includes(file.type)) {
          invalidFiles.push(`${file.name}: File type not supported`)
          return
        }

        // Check for empty files
        if (file.size === 0) {
          invalidFiles.push(`${file.name}: File is empty`)
          return
        }

        validFiles.push(file)
      })

      if (invalidFiles.length > 0) {
        toast.error(`Some files were rejected:\n${invalidFiles.join('\n')}`)
      }

      if (validFiles.length === 0) {
        return
      }

      // Process valid files
      const newFiles: UploadedFile[] = validFiles.map((file) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const uploadedFile: UploadedFile = {
          file,
          id,
        }

        // Create preview for images
        if (file.type.startsWith('image/')) {
          uploadedFile.preview = URL.createObjectURL(file)
        }

        return uploadedFile
      })

      onFilesChange([...files, ...newFiles])
      toast.success(`${validFiles.length} file(s) added successfully`)
    },
    [files, maxFiles, maxFileSize, acceptedFileTypes, onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    multiple: maxFiles > 1,
  })

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)

    // Revoke preview URLs for removed files
    const removedFile = files.find((f) => f.id === fileId)
    if (removedFile?.preview) {
      URL.revokeObjectURL(removedFile.preview)
    }

    onFilesChange(updatedFiles)
    toast.success('File removed')
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    }
    return <File className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive || dragActive
            ? 'border-yellow-500 bg-yellow-50'
            : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-yellow-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-yellow-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Max {maxFiles} file(s), up to {maxFileSize}MB each
        </p>
        <p className="text-xs text-gray-500">Supported: Images, PDF, DOC, TXT</p>
      </div>

      {/* Error Message */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </Label>
          <div className="space-y-2">
            {files.map((uploadedFile) => (
              <div
                key={uploadedFile.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
              >
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview ? (
                    <img
                      src={uploadedFile.preview}
                      alt="Preview"
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    getFileIcon(uploadedFile.file)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadedFile.file.size)} • {uploadedFile.file.type}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadedFile.id)}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Cleanup function to revoke object URLs
export const cleanupFileUploads = (files: UploadedFile[]) => {
  files.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview)
    }
  })
}
