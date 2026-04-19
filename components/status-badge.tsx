'use client'

import { cn } from '@/lib/utils'

type Status = 'ne-pritje' | 'ne-trajtim' | 'perfunduar' | 'anuluar' | 'paguar' | 'papaguar' | 'pjeserisht'

const STATUS_CONFIG: Record<Status, { label: string; classes: string }> = {
  'ne-pritje': { label: 'Në Pritje', classes: 'bg-amber-100 text-amber-700 border-amber-200' },
  'ne-trajtim': { label: 'Në Trajtim', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
  'perfunduar': { label: 'Përfunduar', classes: 'bg-green-100 text-green-700 border-green-200' },
  'anuluar': { label: 'Anuluar', classes: 'bg-red-100 text-red-700 border-red-200' },
  'paguar': { label: 'Paguar', classes: 'bg-green-100 text-green-700 border-green-200' },
  'papaguar': { label: 'Papaguar', classes: 'bg-red-100 text-red-700 border-red-200' },
  'pjeserisht': { label: 'Pjesërisht', classes: 'bg-amber-100 text-amber-700 border-amber-200' },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', config.classes)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  )
}
