'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  Bell,
  UserCog,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const ADMIN_NAV: NavItem[] = [
  { label: 'Paneli Kryesor', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Menaxhimi i Mjekëve', href: '/dashboard/admin/doctors', icon: UserCog },
  { label: 'Pacientët', href: '/dashboard/admin/patients', icon: Users },
  { label: 'Kalendari Global', href: '/dashboard/admin/calendar', icon: Calendar },
  { label: 'Financat', href: '/dashboard/admin/finance', icon: CreditCard },
  { label: 'Raportet', href: '/dashboard/admin/reports', icon: FileText },
]

const DOCTOR_NAV: NavItem[] = [
  { label: 'Paneli Im', href: '/dashboard/mjek', icon: LayoutDashboard },
  { label: 'Pacientët e Mi', href: '/dashboard/mjek/patients', icon: Users },
  { label: 'Kalendari Im', href: '/dashboard/mjek/calendar', icon: Calendar },
  { label: 'Shënime', href: '/dashboard/mjek/notes', icon: FileText },
]

const RECEPSION_NAV: NavItem[] = [
  { label: 'Paneli Qendror', href: '/dashboard/recepsion', icon: LayoutDashboard },
  { label: 'Terminet', href: '/dashboard/recepsion/appointments', icon: Calendar },
  { label: 'Pacientët', href: '/dashboard/recepsion/patients', icon: Users },
  { label: 'Faturimi', href: '/dashboard/recepsion/billing', icon: CreditCard },
]

const NAV_BY_ROLE = { admin: ADMIN_NAV, mjek: DOCTOR_NAV, recepsion: RECEPSION_NAV }

export function Sidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null
  const navItems = NAV_BY_ROLE[user.role]

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center size-9 rounded-xl bg-sidebar-primary">
          <Stethoscope className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sidebar-foreground font-bold text-base tracking-tight">DentraFlow</p>
          <p className="text-sidebar-foreground/50 text-xs capitalize">{user.role === 'admin' ? 'Super Admin' : user.role === 'mjek' ? 'Mjek' : 'Recepsion'}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-sidebar-primary text-white shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="size-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="size-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-sidebar-border pt-4 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/50">
          <div className="flex items-center justify-center size-8 rounded-full bg-sidebar-primary text-white text-xs font-bold">
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sidebar-foreground text-sm font-medium truncate">{user.name}</p>
            <p className="text-sidebar-foreground/50 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full"
        >
          <LogOut className="size-4" />
          <span>Dil</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
        aria-label="Hap menunë"
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-sidebar transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
          aria-label="Mbyll menunë"
        >
          <X className="size-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>
    </>
  )
}
