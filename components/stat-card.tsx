'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  trend?: { value: string; positive: boolean }
  icon: React.ComponentType<{ className?: string }>
  iconBg?: string
  iconColor?: string
}

export function StatCard({ label, value, subtext, trend, icon: Icon, iconBg = 'bg-primary/10', iconColor = 'text-primary' }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className={cn('flex items-center justify-center size-11 rounded-xl flex-shrink-0', iconBg)}>
        <Icon className={cn('size-5', iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-foreground text-2xl font-bold mt-0.5 leading-none">{value}</p>
        {subtext && <p className="text-muted-foreground text-xs mt-1">{subtext}</p>}
        {trend && (
          <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-medium', trend.positive ? 'text-green-600' : 'text-red-500')}>
            {trend.positive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
      <div className="size-11 rounded-xl skeleton flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 rounded skeleton w-24" />
        <div className="h-7 rounded skeleton w-32" />
        <div className="h-3 rounded skeleton w-20" />
      </div>
    </div>
  )
}
