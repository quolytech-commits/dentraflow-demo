'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, Search, X, ChevronDown, CheckCheck } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'
import { MOCK_PATIENTS, MOCK_APPOINTMENTS } from '@/lib/mock-data'

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'Arta Berisha ka një termin sot në 09:00', time: '5 min më parë', read: false },
  { id: 2, text: 'Pagesa nga Driton Krasniqi është e pazgjidhur', time: '1 orë më parë', read: false },
  { id: 3, text: 'Dr. Elira Musa ka shtuar 3 pacientë të rinj', time: '2 orë më parë', read: true },
  { id: 4, text: 'Termini i Besnik Ramës u konfirmua', time: '3 orë më parë', read: true },
]

interface SearchResult {
  type: 'patient' | 'appointment'
  label: string
  sub: string
}

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [searchQ, setSearchQ] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const unread = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markOneRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  // Search results — combines patients + appointments
  const searchResults: SearchResult[] = searchQ.trim().length >= 1
    ? [
        ...MOCK_PATIENTS
          .filter((p) => p.name.toLowerCase().includes(searchQ.toLowerCase()))
          .slice(0, 3)
          .map((p) => ({ type: 'patient' as const, label: p.name, sub: `${p.age} vjeç · ${p.doctor}` })),
        ...MOCK_APPOINTMENTS
          .filter((a) => a.patientName.toLowerCase().includes(searchQ.toLowerCase()))
          .slice(0, 2)
          .map((a) => ({ type: 'appointment' as const, label: a.patientName, sub: `${a.date} ${a.time} — ${a.type}` })),
      ]
    : []

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center gap-4">
      {/* Title - offset for mobile hamburger */}
      <h1 className="text-foreground font-semibold text-lg ml-12 lg:ml-0 flex-1 truncate">{title}</h1>

      {/* Search */}
      <div ref={searchRef} className="relative hidden md:block">
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-150',
          searchFocused ? 'border-accent bg-white shadow-sm w-72' : 'border-border bg-secondary w-56'
        )}>
          <Search className="size-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Kërko pacient ose termin..."
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
          />
          {searchQ && (
            <button onClick={() => setSearchQ('')} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Search dropdown */}
        {searchFocused && searchQ.trim().length >= 1 && (
          <div className="absolute top-12 left-0 right-0 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">
            {searchResults.length === 0 ? (
              <div className="px-4 py-4 text-center text-sm text-muted-foreground">Nuk u gjet asgjë</div>
            ) : (
              <div className="divide-y divide-border">
                {searchResults.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/50 transition-colors cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setSearchQ(''); setSearchFocused(false) }}
                  >
                    <span className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-md uppercase tracking-wide',
                      r.type === 'patient' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {r.type === 'patient' ? 'Pacient' : 'Termin'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-foreground">Njoftimet</p>
                  {unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold">{unread}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      <CheckCheck className="size-3.5" />
                      Shëno të gjitha
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)}>
                    <X className="size-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    className={cn(
                      'px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer',
                      !n.read && 'bg-accent/5'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn('mt-1.5 size-1.5 rounded-full flex-shrink-0', !n.read ? 'bg-accent' : 'bg-transparent')} />
                      <div className="flex-1">
                        <p className={cn('text-sm leading-relaxed', !n.read ? 'text-foreground font-medium' : 'text-muted-foreground')}>{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {notifications.every((n) => n.read) && (
                <div className="px-4 py-3 text-center text-xs text-muted-foreground border-t border-border">
                  Të gjitha njoftimet u lexuan
                </div>
              )}
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
