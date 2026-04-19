'use client'

import { useState } from 'react'
import { Users, Calendar, Clock, CheckCircle, Search, ChevronDown } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CalendarWidget } from '@/components/calendar-widget'
import { PatientModal } from '@/components/patient-modal'
import { useAuth } from '@/lib/auth-context'
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, Patient, Appointment } from '@/lib/mock-data'

type AppStatus = 'ne-pritje' | 'ne-trajtim' | 'perfunduar' | 'anuluar'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const doctorName = user?.name ?? 'Dr. Andi Hoxha'

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchQ, setSearchQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)

  // Filter appointments and patients for the logged-in doctor
  const myPatients = MOCK_PATIENTS.filter((p) => p.doctor === doctorName)
  const myAppts = appointments.filter((a) => a.doctorName === doctorName)
  const todayAppts = myAppts.filter((a) => a.date === '2026-04-20')

  const filtered = myPatients
    .filter((p) => p.name.toLowerCase().includes(searchQ.toLowerCase()))
    .filter((p) => statusFilter === 'all' || p.status === statusFilter)

  const changeApptStatus = (id: string, status: AppStatus) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title={`Paneli Im — ${doctorName}`} />

      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pacientët e Mi" value={String(myPatients.length)} subtext="Në ngarkim tim" icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Termine Sot" value={String(todayAppts.length)} subtext="Në ditën e sotme" icon={Calendar} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <StatCard label="Të Përfunduara" value={String(myPatients.filter((p) => p.status === 'perfunduar').length)} subtext="Trajtime të kryera" icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-600" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Patient list */}
          <div className="xl:col-span-2 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h2 className="font-semibold text-foreground">Lista e Pacientëve</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-secondary text-sm">
                  <Search className="size-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    placeholder="Kërko pacient..."
                    className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground w-32"
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
            <CalendarWidget appointments={appointments} filterDoctor={doctorName} />
          </div>
        </div>

        {/* Today's schedule with status change */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Orari i Sotëm</h2>
          {todayAppts.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Clock className="size-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-foreground font-medium">Nuk ka termine sot</p>
              <p className="text-muted-foreground text-sm mt-1">Orari juaj për sot është i lirë</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayAppts.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-2xl flex items-center gap-4 px-4 py-3 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-1.5 text-accent min-w-[64px] flex-shrink-0">
                    <Clock className="size-4 flex-shrink-0" />
                    <span className="text-sm font-mono font-semibold">{a.time}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{a.patientName}</p>
                    <p className="text-sm text-muted-foreground">{a.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    {/* Status dropdown */}
                    <div className="relative group/status">
                      <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-border bg-secondary text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                        <ChevronDown className="size-3" />
                      </button>
                      <div className="absolute right-0 top-8 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden hidden group-hover/status:block min-w-[140px]">
                        {(['ne-pritje', 'ne-trajtim', 'perfunduar'] as AppStatus[]).map((s) => (
                          <button
                            key={s}
                            onClick={() => changeApptStatus(a.id, s)}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors ${a.status === s ? 'font-semibold text-accent' : 'text-foreground'}`}
                          >
                            {s === 'ne-pritje' ? 'Në Pritje' : s === 'ne-trajtim' ? 'Në Trajtim' : 'Përfunduar'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All appointments table */}
        {myAppts.length > todayAppts.length && (
          <div>
            <h2 className="font-semibold text-foreground mb-3">Të Gjitha Terminet</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pacienti</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data · Ora</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Lloji</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ndrysho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {myAppts.map((a) => (
                      <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{a.patientName}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{a.date} · {a.time}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{a.type}</td>
                        <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                        <td className="px-4 py-3 text-right">
                          <select
                            value={a.status}
                            onChange={(e) => changeApptStatus(a.id, e.target.value as AppStatus)}
                            className="px-2 py-1.5 rounded-lg border border-border bg-secondary text-xs text-foreground outline-none focus:border-accent transition-all"
                          >
                            <option value="ne-pritje">Në Pritje</option>
                            <option value="ne-trajtim">Në Trajtim</option>
                            <option value="perfunduar">Përfunduar</option>
                            <option value="anuluar">Anuluar</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
      )}
    </div>
  )
}
