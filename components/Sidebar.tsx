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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/authContext'
import { useState } from 'react'

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

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
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out z-30 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                <span className="text-sidebar-primary-foreground font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">Aeroplay</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border space-y-2">
            <div className="text-sm text-sidebar-foreground/70">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs">{user?.role}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 bg-transparent"
              onClick={async () => {
                await logout()
                window.location.href = '/login'
              }}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setOpen(false)} />}
    </>
  )
}
