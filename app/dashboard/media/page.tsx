'use client'

import React from "react"

import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Trash2, ImageIcon, Video, Music } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

interface MediaFile {
  _id: string
  title: string
  filename: string
  url: string
  type: 'image' | 'video' | 'audio'
  size: number
  uploadedBy: { name: string }
  createdAt: string
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [typeFilter])

  async function fetchMedia() {
    try {
      setLoading(true)
      const params = typeFilter !== 'all' ? `?type=${typeFilter}` : ''
      const response = await fetch(`/api/media${params}`)
      const data = await response.json()
      setMedia(data.data || [])
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.currentTarget.files
    if (!files) return

    setUploading(true)

    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name)

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setMedia([data.data, ...media])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }

    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function deleteMedia(id: string) {
    if (!confirm('Delete this media?')) return

    try {
      const response = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setMedia(media.filter((m) => m._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete media:', error)
    }
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={48} className="text-orange-400" />
      case 'audio':
        return <Music size={48} className="text-purple-400" />
      default:
        return <ImageIcon size={48} className="text-blue-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground mt-2">Upload and manage your images, videos, and audio files</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Upload size={20} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Media'}
          </Button>
          <input ref={fileInputRef} type="file" multiple hidden onChange={handleFileUpload} accept="image/*,video/*,audio/*" />
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-2">
            {(['all', 'image', 'video', 'audio'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  typeFilter === type ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-card/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading media...</p>
          </div>
        ) : media.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <Upload size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No media files</h3>
            <p className="text-muted-foreground mt-2">Upload your first file to get started</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {media.map((file) => (
              <Card key={file._id} className="overflow-hidden hover:border-border/80 transition-colors">
                <div className="aspect-square bg-card/50 flex items-center justify-center relative group">
                  {getMediaIcon(file.type)}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMedia(file._id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground truncate" title={file.title}>
                    {file.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{formatFileSize(file.size)}</p>
                  <p className="text-xs text-muted-foreground">{file.uploadedBy.name}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(file.createdAt).toLocaleDateString()}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
