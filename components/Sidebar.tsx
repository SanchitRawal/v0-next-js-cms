'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Music,
  Video,
  Users,
  Settings,
  Tag,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/authContext'
import { useTheme } from '@/lib/themeContext'
import { useSidebar } from '@/lib/sidebarContext'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [open, setOpen] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/content', icon: FileText, label: 'Content' },
    { href: '/dashboard/videos', icon: Video, label: 'Videos' },
    { href: '/dashboard/audio', icon: Music, label: 'Audio' },
    { href: '/dashboard/media', icon: Tag, label: 'Media Library' },
    ...(user?.role === 'admin'
      ? [
          { href: '/dashboard/users', icon: Users, label: 'Users' },
          { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
        ]
      : []),
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-40"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <aside
        className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transform transition-all duration-300 ease-in-out z-30 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          <div className={`border-b border-sidebar-border flex items-center justify-between ${isCollapsed ? 'px-3 py-4' : 'px-6 py-4'}`}>
            <Link href="/dashboard" className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-2'}`}>
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sidebar-primary-foreground font-bold text-sm">A</span>
              </div>
              {!isCollapsed && <span className="font-bold text-lg text-sidebar-foreground">Aeroplay</span>}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={toggleSidebar}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>

          <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  title={isCollapsed ? item.label : ''}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors justify-start ${
                    isCollapsed ? 'justify-center px-3' : ''
                  } ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t border-sidebar-border space-y-2">
            {!isCollapsed && (
              <div className="text-sm text-sidebar-foreground/70 px-1">
                <p className="font-medium text-xs truncate">{user?.name}</p>
                <p className="text-xs opacity-70 truncate">{user?.role}</p>
              </div>
            )}
            
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                title={isCollapsed ? 'Theme' : ''}
                className={`w-full gap-2 bg-transparent ${isCollapsed ? 'justify-center px-3' : 'justify-start'}`}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
              >
                {theme === 'light' ? <Sun size={16} /> : theme === 'dark' ? <Moon size={16} /> : <Monitor size={16} />}
                {!isCollapsed && <span className="text-sm">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>}
              </Button>

              {showThemeMenu && (
                <div className={`absolute bottom-full mb-2 bg-sidebar rounded-lg border border-sidebar-border shadow-lg overflow-hidden z-50 ${isCollapsed ? 'left-full ml-2 w-32' : 'left-0 right-0'}`}>
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTheme(t)
                        setShowThemeMenu(false)
                      }}
                      className={`w-full px-3 py-2 text-sm text-left flex items-center gap-2 ${
                        theme === t ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
                      }`}
                    >
                      {t === 'light' ? <Sun size={14} /> : t === 'dark' ? <Moon size={14} /> : <Monitor size={14} />}
                      {!isCollapsed && <span>{t.charAt(0).toUpperCase() + t.slice(1)}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              title={isCollapsed ? 'Logout' : ''}
              className={`w-full gap-2 bg-transparent ${isCollapsed ? 'justify-center px-3' : 'justify-start'}`}
              onClick={async () => {
                await logout()
                window.location.href = '/login'
              }}
            >
              <LogOut size={16} />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
