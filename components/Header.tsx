'use client'

import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/themeContext'
import { useState } from 'react'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-card border-b border-border flex items-center justify-end px-6 z-20">
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          title={`Current theme: ${theme}`}
        >
          {theme === 'light' ? (
            <Sun size={18} />
          ) : theme === 'dark' ? (
            <Moon size={18} />
          ) : (
            <Monitor size={18} />
          )}
          <span className="hidden sm:inline text-sm font-medium">
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
        </Button>

        {showThemeMenu && (
          <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-[150px]">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTheme(t)
                  setShowThemeMenu(false)
                }}
                className={`w-full px-4 py-2 text-sm text-left flex items-center gap-2 transition-colors ${
                  theme === t
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                {t === 'light' ? (
                  <Sun size={16} />
                ) : t === 'dark' ? (
                  <Moon size={16} />
                ) : (
                  <Monitor size={16} />
                )}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
