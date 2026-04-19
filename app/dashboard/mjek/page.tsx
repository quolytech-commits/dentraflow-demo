'use client'

import { useState } from 'react'
import { Users, Calendar, Clock, CheckCircle, Search } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CalendarWidget } from '@/components/calendar-widget'
import { PatientModal } from '@/components/patient-modal'
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, Patient } from '@/lib/mock-data'

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchQ, setSearchQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const myPatients = MOCK_PATIENTS.filter((p) => p.doctor === 'Dr. Andi Hoxha')
  const myAppts = MOCK_APPOINTMENTS.filter((a) => a.doctorName === 'Dr. Andi Hoxha')

  const filtered = myPatients
    .filter((p) => p.name.toLowerCase().includes(searchQ.toLowerCase()))
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Paneli Im — Dr. Andi Hoxha" />

      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pacientët e Mi" value={String(myPatients.length)} subtext="Në ngarkim tim" icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Termine Sot" value={String(myAppts.filter((a) => a.date === '2026-04-20').length)} subtext="Në ditën e sotme" icon={Calendar} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <StatCard label="Të Përfunduara" value={String(myPatients.filter((p) => p.status === 'perfunduar').length)} subtext="Trajtime të kryera" icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-600" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient list */}
          <div className="xl:col-span-2 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-semibold text-foreground">Lista e Pacientëve</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-secondary text-sm">
                  <Search className="size-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Kërko..."
                    className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-28"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border bg-secondary text-sm text-foreground outline-none"
                >
                  <option value="all">Të gjithë</option>
                  <option value="ne-pritje">Në Pritje</option>
                  <option value="ne-trajtim">Në Trajtim</option>
                  <option value="perfunduar">Përfunduar</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-12 text-center">
                <Users className="size-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-foreground font-medium">Nuk u gjetën pacientë</p>
                <p className="text-muted-foreground text-sm mt-1">Provoni të ndryshoni filtrat e kërkimit</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-accent/30 transition-all text-left group"
                  >
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{p.age} vjeç · {p.treatments[0]}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Vizita e fundit</p>
                      <p className="text-sm font-medium text-foreground">{p.lastVisit}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Calendar */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Kalendari Im</h2>
            <CalendarWidget filterDoctor="Dr. Andi Hoxha" />
          </div>
        </div>

        {/* Today's schedule */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Orari i Sotëm</h2>
          <div className="space-y-2">
            {myAppts.slice(0, 4).map((a) => (
              <div key={a.id} className="bg-card border border-border rounded-2xl flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-1.5 text-accent min-w-[60px]">
                  <Clock className="size-4 flex-shrink-0" />
                  <span className="text-sm font-mono font-semibold">{a.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{a.patientName}</p>
                  <p className="text-sm text-muted-foreground">{a.type}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPatient && (
        <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  )
}
