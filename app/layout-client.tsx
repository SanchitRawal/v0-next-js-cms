'use client'

import { AuthProvider } from '@/lib/authContext'
import { ThemeProvider } from '@/lib/themeContext'
import { SidebarProvider } from '@/lib/sidebarContext'

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
