'use client'

import { AuthProvider } from '@/lib/authContext'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
