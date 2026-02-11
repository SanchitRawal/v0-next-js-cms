'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { ContentForm } from '@/components/ContentForm'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function EditContentPage() {
  const router = useRouter()
  const params = useParams()
  const contentId = params.id as string

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <Link href="/dashboard/content" className="flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft size={20} />
          Back to Content
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Content</h1>
          <p className="text-muted-foreground mt-2">Update your content details</p>
        </div>

        <ContentForm
          contentId={contentId}
          onSuccess={() => {
            router.push('/dashboard/content')
          }}
        />
      </div>
    </DashboardLayout>
  )
}
