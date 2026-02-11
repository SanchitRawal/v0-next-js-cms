import React from 'react'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'
import RootLayoutClient from './layout-client'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aeroplay Media CMS',
  description: 'Professional content management system for Aeroplay Media',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  )
}
