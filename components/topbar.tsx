'use client'

import { useState } from 'react'
import { Bell, Search, X, ChevronDown } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

const NOTIFICATIONS = [
  { id: 1, text: 'Arta Berisha ka një termin sot në 09:00', time: '5 min më parë', read: false },
  { id: 2, text: 'Pagesa nga Driton Krasniqi është e pazgjidhur', time: '1 orë më parë', read: false },
  { id: 3, text: 'Dr. Elira Musa ka shtuar 3 pacientë të rinj', time: '2 orë më parë', read: true },
  { id: 4, text: 'Termini i Besnik Ramës u konfirmua', time: '3 orë më parë', read: true },
]

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const unread = NOTIFICATIONS.filter((n) => !n.read).length

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center gap-4">
      {/* Title - offset for mobile hamburger */}
      <h1 className="text-foreground font-semibold text-lg ml-12 lg:ml-0 flex-1">{title}</h1>

      {/* Search */}
      <div className={cn('hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150 w-56', searchFocused ? 'border-accent bg-white shadow-sm w-72' : 'border-border bg-secondary')}>
        <Search className="size-4 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          placeholder="Kërko..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative flex items-center justify-center size-9 rounded-xl border border-border bg-secondary hover:bg-muted transition-colors"
          aria-label="Njoftimet"
        >
          <Bell className="size-4 text-muted-foreground" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center size-4 rounded-full bg-accent text-white text-[10px] font-bold">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-12 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="font-semibold text-sm text-foreground">Njoftimet</p>
                <button onClick={() => setNotifOpen(false)}><X className="size-4 text-muted-foreground hover:text-foreground" /></button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className={cn('px-4 py-3 hover:bg-secondary/50 transition-colors', !n.read && 'bg-accent/5')}>
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="mt-1.5 size-1.5 rounded-full bg-accent flex-shrink-0" />}
                      {n.read && <span className="mt-1.5 size-1.5 flex-shrink-0" />}
                      <div>
                        <p className="text-sm text-foreground leading-relaxed">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-secondary hover:bg-muted transition-colors cursor-default">
        <div className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          {user.avatar}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">{user.name}</span>
        <ChevronDown className="size-3.5 text-muted-foreground hidden sm:block" />
      </div>
    </header>
  )
}
