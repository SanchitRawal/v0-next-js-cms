'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit, Eye, Video } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Content {
  _id: string
  title: string
  description: string
  type: 'video' | 'audio' | 'post'
  category: string
  status: 'draft' | 'published'
  author: { name: string }
  views: number
  createdAt: string
}

export default function VideosPage() {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    try {
      setLoading(true)
      const response = await fetch('/api/content?type=video')
      const data = await response.json()
      setContent(data.data || [])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteContent(id: string) {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/content/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setContent(content.filter((c) => c._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Videos</h1>
            <p className="text-muted-foreground mt-2">Manage your video content</p>
          </div>
          <Link href="/dashboard/content/create">
            <Button>
              <Plus size={20} className="mr-2" />
              New Video
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : content.length === 0 ? (
          <Card className="p-12 text-center">
            <Video size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No videos yet</h3>
            <p className="text-muted-foreground mt-2">Create your first video content</p>
            <Link href="/dashboard/content/create" className="mt-4 inline-block">
              <Button variant="outline">Create Video</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <Card key={item._id} className="p-6 hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Category: {item.category}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {item.views} views
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/dashboard/content/${item._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => deleteContent(item._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
