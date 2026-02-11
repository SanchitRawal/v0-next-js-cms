'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { ContentForm } from '@/components/ContentForm'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateContentPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <Link href="/dashboard/content" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          Back to Content
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Content</h1>
          <p className="text-muted-foreground mt-2">Add a new video, audio, or blog post</p>
        </div>

        <ContentForm
          onSuccess={() => {
            router.push('/dashboard/content')
          }}
        />
      </div>
    </DashboardLayout>
  )
}
