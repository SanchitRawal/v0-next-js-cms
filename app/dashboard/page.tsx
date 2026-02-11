'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Card } from '@/components/ui/card'
import { Video, Music, FileText, Users, TrendingUp, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalContent: 0,
    totalVideos: 0,
    totalAudio: 0,
    totalUsers: 0,
    totalViews: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/content')
        const data = await response.json()
        const content = data.data || []

        const videos = content.filter((c: any) => c.type === 'video').length
        const audio = content.filter((c: any) => c.type === 'audio').length
        const totalViews = content.reduce((sum: number, c: any) => sum + (c.views || 0), 0)

        setStats({
          totalContent: content.length,
          totalVideos: videos,
          totalAudio: audio,
          totalUsers: 0,
          totalViews,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Content',
      value: stats.totalContent,
      icon: FileText,
      color: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'Videos',
      value: stats.totalVideos,
      icon: Video,
      color: 'bg-orange-500/20 text-orange-400',
    },
    {
      title: 'Audio Files',
      value: stats.totalAudio,
      icon: Music,
      color: 'bg-purple-500/20 text-purple-400',
    },
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'bg-green-500/20 text-green-400',
    },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back to your content hub</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <a href="/dashboard/content" className="block p-3 rounded-lg hover:bg-card transition-colors">
                <p className="font-medium text-foreground">Create New Content</p>
                <p className="text-sm text-muted-foreground">Add videos, audio, or blog posts</p>
              </a>
              <a href="/dashboard/media" className="block p-3 rounded-lg hover:bg-card transition-colors">
                <p className="font-medium text-foreground">Manage Media</p>
                <p className="text-sm text-muted-foreground">Upload and organize your files</p>
              </a>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Getting Started</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Set up your content categories</p>
              <p>✓ Upload your first video or audio file</p>
              <p>✓ Create engaging content</p>
              <p>✓ Monitor content performance</p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
