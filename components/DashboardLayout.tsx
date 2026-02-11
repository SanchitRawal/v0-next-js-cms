'use client'

import React from "react"

import { useAuth } from '@/lib/authContext'
import { Sidebar } from './Sidebar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 overflow-auto">
        <div className="pt-16 md:pt-0 px-4 md:px-8 py-8 h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
