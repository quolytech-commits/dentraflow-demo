'use client'

import { Topbar } from '@/components/topbar'
import { CalendarWidget } from '@/components/calendar-widget'
import { useAuth } from '@/lib/auth-context'
import { MOCK_APPOINTMENTS } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { Clock } from 'lucide-react'

export default function DoctorCalendarPage() {
  const { user } = useAuth()
  const doctorName = user?.name ?? 'Dr. Andi Hoxha'
  const myAppts = MOCK_APPOINTMENTS.filter((a) => a.doctorName === doctorName)

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Kalendari Im" />
      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CalendarWidget appointments={myAppts} filterDoctor={doctorName} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-3">Të Gjitha Terminet</h2>
            <div className="space-y-2">
              {myAppts.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <Clock className="size-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nuk ka termine</p>
                </div>
              ) : myAppts.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-2xl flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-1 text-accent flex-shrink-0 min-w-[60px]">
                    <Clock className="size-3.5" />
                    <span className="text-xs font-mono font-semibold">{a.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.patientName}</p>
                    <p className="text-xs text-muted-foreground">{a.date} · {a.type}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
