'use client'

import { useState } from 'react'
import { Topbar } from '@/components/topbar'
import { CalendarWidget } from '@/components/calendar-widget'
import { StatusBadge } from '@/components/status-badge'
import { MOCK_APPOINTMENTS, MOCK_DOCTORS } from '@/lib/mock-data'
import { Clock } from 'lucide-react'

export default function AdminCalendarPage() {
  const [doctorFilter, setDoctorFilter] = useState<string>('all')

  const filtered = doctorFilter === 'all'
    ? MOCK_APPOINTMENTS
    : MOCK_APPOINTMENTS.filter((a) => a.doctorName === doctorFilter)

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Kalendari Global" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        {/* Doctor filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground">Filtro:</span>
          <button
            onClick={() => setDoctorFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${doctorFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-foreground hover:bg-muted'}`}
          >
            Të gjithë mjekët
          </button>
          {MOCK_DOCTORS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDoctorFilter(d.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${doctorFilter === d.name ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-foreground hover:bg-muted'}`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CalendarWidget appointments={filtered} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-3">
              {doctorFilter === 'all' ? 'Të gjitha terminet' : `Terminet — ${doctorFilter}`}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
            </h2>
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {filtered.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-8 text-center">
                  <Clock className="size-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nuk ka termine</p>
                </div>
              ) : filtered.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-2xl flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 transition-colors">
                  <div className="flex flex-col items-center text-accent flex-shrink-0 min-w-[48px]">
                    <span className="text-xs font-mono font-semibold">{a.time}</span>
                    <span className="text-[10px] text-muted-foreground">{a.date.slice(5)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.patientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{a.doctorName} · {a.type}</p>
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
