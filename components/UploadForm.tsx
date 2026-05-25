'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileUp, Image, X, Loader } from 'lucide-react'

const formSchema = z.object({
  pdfFile: z.instanceof(File).refine(file => file.size <= 50 * 1024 * 1024, 'PDF file must be max 50MB'),
  coverImage: z.instanceof(File).optional().refine(
    file => !file || file.type.startsWith('image/'),
    'Cover image must be an image file'
  ),
  title: z.string().min(1, 'Title is required').min(2, 'Title must be at least 2 characters'),
  author: z.string().min(1, 'Author name is required').min(2, 'Author name must be at least 2 characters'),
  voice: z.enum(['Dave', 'Daniel', 'Chris', 'Rachel', 'Sarah'], { message: 'Please select a voice' }),
})

const voiceOptions = {
  'Male Voices': [
    { id: 'Dave', label: 'Dave', description: 'Clear and professional' },
    { id: 'Daniel', label: 'Daniel', description: 'Warm and engaging' },
    { id: 'Chris', label: 'Chris', description: 'Calm and steady' },
  ],
  'Female Voices': [
    { id: 'Rachel', label: 'Rachel', description: 'Natural and expressive' },
    { id: 'Sarah', label: 'Sarah', description: 'Friendly and approachable' },
  ],
}

function LoadingOverlay() {
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper bg-white">
        <div className="loading-shadow">
          <Loader className="loading-animation w-12 h-12 text-[#663820]" />
          <h3 className="loading-title">Processing Your Book</h3>
          <div className="loading-progress">
            <div className="loading-progress-item">
              <span className="text-sm text-[var(--text-primary)]">Uploading files...</span>
              <div className="loading-progress-status"></div>
            </div>
            <div className="loading-progress-item">
              <span className="text-sm text-[var(--text-primary)]">Initializing synthesis...</span>
              <div className="loading-progress-status"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PDFDropzone({ value, onChange, error }) {
  const fileInputRef = React.useRef(null)

  const handleClick = () => fileInputRef.current?.click()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onChange(file)
  }

  const handleRemove = () => {
    onChange(undefined)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <label className="form-label">PDF File</label>
      {!value ? (
        <div
          className="upload-dropzone border-2 border-dashed border-[#ddd]"
          onClick={handleClick}
        >
          <FileUp className="upload-dropzone-icon" />
          <p className="upload-dropzone-text">Click to upload PDF</p>
          <p className="upload-dropzone-hint">PDF file (max 50MB)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            aria-label="PDF file input"
          />
        </div>
      ) : (
        <div className="upload-dropzone upload-dropzone-uploaded">
          <div className="flex items-center justify-between w-full px-4">
            <span className="upload-dropzone-text">{value.name}</span>
            <button
              onClick={handleRemove}
              type="button"
              className="upload-dropzone-remove"
              aria-label="Remove PDF file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

function ImageDropzone({ value, onChange, error }) {
  const fileInputRef = React.useRef(null)

  const handleClick = () => fileInputRef.current?.click()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onChange(file)
  }

  const handleRemove = () => {
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div>
      <label className="form-label">Cover Image</label>
      {!value ? (
        <div
          className="upload-dropzone border-2 border-dashed border-[#ddd]"
          onClick={handleClick}
        >
          <Image className="upload-dropzone-icon" />
          <p className="upload-dropzone-text">Click to upload cover image</p>
          <p className="upload-dropzone-hint">Leave empty to auto-generate from PDF</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Cover image input"
          />
        </div>
      ) : (
        <div className="upload-dropzone upload-dropzone-uploaded">
          <div className="flex items-center justify-between w-full px-4">
            <span className="upload-dropzone-text">{value.name}</span>
            <button
              onClick={handleRemove}
              type="button"
              className="upload-dropzone-remove"
              aria-label="Remove cover image"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

function VoiceSelector({ value, onChange, error }) {
  return (
    <div>
      <label className="form-label">Choose Assistant Voice</label>
      <div className="space-y-4">
        {Object.entries(voiceOptions).map(([groupName, voices]) => (
          <div key={groupName}>
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">{groupName}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {voices.map(voice => (
                <label
                  key={voice.id}
                  className={`voice-selector-option ${
                    value === voice.id ? 'voice-selector-option-selected' : 'voice-selector-option-default'
                  }`}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={voice.id}
                    checked={value === voice.id}
                    onChange={() => onChange(voice.id)}
                    className="sr-only"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-[var(--text-primary)]">{voice.label}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{voice.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

export default function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [coverImage, setCoverImage] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdfFile: undefined,
      coverImage: undefined,
      title: '',
      author: '',
      voice: 'Dave',
    },
  })

  const voiceValue = watch('voice')

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('pdfFile', data.pdfFile)
      if (data.coverImage) {
        formData.append('coverImage', data.coverImage)
      }
      formData.append('title', data.title)
      formData.append('author', data.author)
      formData.append('voice', data.voice)

      const response = await fetch('/api/books/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      // Success - redirect or show success message
      const result = await response.json()
      // Handle success (e.g., redirect to book page)
    } catch (error) {
      console.error('Upload error:', error)
      // Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={handleSubmit(onSubmit)} className="new-book-wrapper">
        <div className="space-y-8">
          <PDFDropzone
            value={pdfFile}
            onChange={(file) => {
              setPdfFile(file)
              setValue('pdfFile', file)
            }}
            error={errors.pdfFile?.message}
          />

          <ImageDropzone
            value={coverImage}
            onChange={(file) => {
              setCoverImage(file)
              setValue('coverImage', file)
            }}
            error={errors.coverImage?.message}
          />

          <div>
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="ex: Rich Dad Poor Dad"
              className="form-input"
              {...register('title')}
            />
            {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>}
          </div>

          <div>
            <label className="form-label">Author Name</label>
            <input
              type="text"
              placeholder="ex: Robert Kiyosaki"
              className="form-input"
              {...register('author')}
            />
            {errors.author && <p className="text-red-500 text-sm mt-2">{errors.author.message}</p>}
          </div>

          <VoiceSelector
            value={voiceValue}
            onChange={(voice) => setValue('voice', voice)}
            error={errors.voice?.message}
          />

          <button type="submit" disabled={isSubmitting} className="form-btn">
            {isSubmitting ? 'Processing...' : 'Begin Synthesis'}
          </button>
        </div>
      </form>
    </>
  )
}
