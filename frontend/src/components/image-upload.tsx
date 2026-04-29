"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Check, X, ImageIcon, RefreshCw } from 'lucide-react'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  isUploading: boolean
  imageId?: string
  uploadError?: boolean
}

export function ImageUpload({ onImageSelect, isUploading, imageId, uploadError = false }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (uploadError && previewUrl) {

    }
  }, [uploadError, previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {

      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      onImageSelect(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const resetUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setPreviewUrl(null)
  }

  return (
    <div className="space-y-2">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <div className="border-2 border-dashed rounded-lg p-4 text-center">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Document preview"
              className="mx-auto max-h-48 object-contain"
            />
            <div className="mt-2 flex items-center justify-center gap-2">
              {isUploading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Upload className="h-4 w-4 animate-pulse" />
                  <span>Uploading...</span>
                </div>
              ) : uploadError ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <X className="h-4 w-4" />
                    <span>Upload failed</span>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={triggerFileInput}>
                      <RefreshCw className="h-4 w-4 mr-1" /> Try Again
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={resetUpload}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : imageId ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span>Upload complete</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-600">
                  <Upload className="h-4 w-4" />
                  <span>Processing...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center gap-2">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
            <Button type="button" variant="outline" size="sm" onClick={triggerFileInput} disabled={isUploading}>
              Select File
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

