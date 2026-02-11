'use client'

import { AuthProvider } from '@/lib/authContext'
import { ThemeProvider } from '@/lib/themeContext'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
