'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme()
  }
  return theme
}

function applyThemeToDocument(resolvedTheme: 'light' | 'dark') {
  const htmlElement = document.documentElement
  if (resolvedTheme === 'dark') {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      // Get saved theme from localStorage
      const savedTheme = (localStorage.getItem('theme') as Theme) || 'system'
      setThemeState(savedTheme)

      // Resolve and apply theme
      const resolved = getResolvedTheme(savedTheme)
      setResolvedTheme(resolved)
      applyThemeToDocument(resolved)
    } catch (error) {
      console.error('[Theme] Failed to initialize theme:', error)
      applyThemeToDocument('dark')
    }

    setMounted(true)
  }, [])

  const handleSetTheme = (newTheme: Theme) => {
    try {
      setThemeState(newTheme)
      localStorage.setItem('theme', newTheme)

      const resolved = getResolvedTheme(newTheme)
      setResolvedTheme(resolved)
      applyThemeToDocument(resolved)
    } catch (error) {
      console.error('[Theme] Failed to set theme:', error)
    }
  }

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = () => {
      const systemTheme = getSystemTheme()
      setResolvedTheme(systemTheme)
      applyThemeToDocument(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  if (!mounted) {
    return <>{children}</>
  }

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: handleSetTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
