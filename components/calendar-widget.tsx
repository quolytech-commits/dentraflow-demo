'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Appointment } from '@/lib/mock-data'

const DAYS_SQ = ['Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht', 'Die']
const MONTHS_SQ = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor']

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

interface CalendarWidgetProps {
  appointments?: Appointment[]
  filterDoctor?: string
}

export function CalendarWidget({ appointments = [], filterDoctor }: CalendarWidgetProps) {
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState<number | null>(today.getDate())

  const cells = getCalendarDays(current.year, current.month)

  const filtered = filterDoctor
    ? appointments.filter((a) => a.doctorName === filterDoctor)
    : appointments

  const hasAppt = (day: number) => {
    const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return filtered.some((a) => a.date === dateStr)
  }

  const selectedAppts = selected
    ? filtered.filter((a) => {
        const dateStr = `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(selected).padStart(2, '0')}`
        return a.date === dateStr
      })
    : []

  const prev = () => setCurrent((c) => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  const next = () => setCurrent((c) => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <p className="font-semibold text-foreground">{MONTHS_SQ[current.month]} {current.year}</p>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={next} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_SQ.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 p-2 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const isToday = day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()
          const isSelected = day === selected
          const hasA = hasAppt(day)
          return (
            <button
              key={day}
              onClick={() => setSelected(day)}
              className={cn(
                'relative flex flex-col items-center justify-center h-9 rounded-lg text-sm font-medium transition-all duration-100',
                isSelected ? 'bg-primary text-primary-foreground' : isToday ? 'bg-accent/15 text-accent font-bold' : 'text-foreground hover:bg-secondary'
              )}
            >
              {day}
              {hasA && (
                <span className={cn('absolute bottom-1 size-1 rounded-full', isSelected ? 'bg-white/70' : 'bg-accent')} />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day appointments */}
      {selectedAppts.length > 0 && (
        <div className="border-t border-border px-4 py-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {selected} {MONTHS_SQ[current.month]} — {selectedAppts.length} termin{selectedAppts.length > 1 ? 'e' : ''}
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {selectedAppts.map((a) => (
              <div key={a.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                <span className="text-xs font-mono text-accent font-semibold w-10 flex-shrink-0">{a.time}</span>
                <span className="text-sm text-foreground flex-1 truncate">{a.patientName}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">{a.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {selected && selectedAppts.length === 0 && (
        <div className="border-t border-border px-4 py-4 text-center text-sm text-muted-foreground">
          Nuk ka termine për këtë ditë
        </div>
      )}
    </div>
  )
}
