'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '@/app/actions/storage'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
  folder?: string
  maxImages?: number
}

export function ImageUploader({ images, onChange, folder = 'packages', maxImages = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploading(true)
    try {
      const newUrls: string[] = []
      for (let i = 0; i < files.length && images.length + newUrls.length < maxImages; i++) {
        const url = await uploadImage(files[i], folder)
        newUrls.push(url)
      }
      onChange([...images, ...newUrls])
    } catch (err) {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= maxImages}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
        <span className="text-xs text-slate-400">{images.length}/{maxImages} images</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">Cover</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
