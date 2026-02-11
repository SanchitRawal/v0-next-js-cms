'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit, Eye, FileText } from 'lucide-react'
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

export default function ContentPage() {
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchContent()
  }, [search, statusFilter])

  async function fetchContent() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/content?${params}`)
      const data = await response.json()
      setContent(data.data || [])
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteContent(id: string) {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch(`/api/content/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setContent(content.filter((c) => c._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
    }
  }

  const typeColors = {
    video: 'bg-orange-500/20 text-orange-400',
    audio: 'bg-purple-500/20 text-purple-400',
    post: 'bg-blue-500/20 text-blue-400',
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content</h1>
            <p className="text-muted-foreground mt-2">Manage your videos, audio, and posts</p>
          </div>
          <Link href="/dashboard/content/create">
            <Button>
              <Plus size={20} className="mr-2" />
              Create Content
            </Button>
          </Link>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg bg-input border border-border text-foreground"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : content.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No content found</h3>
            <p className="text-muted-foreground mt-2">Create your first piece of content</p>
            <Link href="/dashboard/content/create" className="mt-4 inline-block">
              <Button variant="outline">Create Content</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {content.map((item) => (
              <Card key={item._id} className="p-6 hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[item.type]}`}>
                        {item.type}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Category: {item.category}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={14} />
                        {item.views} views
                      </span>
                      <span>By {item.author.name}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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
