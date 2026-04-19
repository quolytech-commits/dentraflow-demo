'use client'

import { useState } from 'react'
import { Calendar, Users, CreditCard, Plus, Edit2, X, Clock, CheckCircle } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CalendarWidget } from '@/components/calendar-widget'
import { AppointmentModal } from '@/components/appointment-modal'
import { PatientModal } from '@/components/patient-modal'
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_PAYMENTS, Patient, Appointment } from '@/lib/mock-data'

export default function ReceptionDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [tab, setTab] = useState<'termine' | 'faturim'>('termine')

  const todayAppts = appointments.filter((a) => a.date === '2026-04-20')
  const pending = appointments.filter((a) => a.status === 'ne-pritje').length
  const done = appointments.filter((a) => a.status === 'perfunduar').length
  const unpaid = MOCK_PAYMENTS.filter((p) => p.status === 'papaguar').length

  const cancelAppt = (id: string) => {
    setAppointments(appointments.map((a) => a.id === id ? { ...a, status: 'anuluar' as const } : a))
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Paneli Qendror — Recepsion" />

      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Termine Sot" value={String(todayAppts.length)} subtext="Gjithsej sot" icon={Calendar} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Në Pritje" value={String(pending)} subtext="Presin konfirmim" icon={Clock} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <StatCard label="Të Kryera" value={String(done)} subtext="Sot" icon={CheckCircle} iconBg="bg-green-50" iconColor="text-green-600" />
          <StatCard label="Fatura Papaguara" value={String(unpaid)} subtext="Kërkojnë faturim" icon={CreditCard} iconBg="bg-red-50" iconColor="text-red-500" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main panel */}
          <div className="xl:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-secondary border border-border rounded-xl p-1 w-fit">
              {([['termine', 'Terminet'], ['faturim', 'Faturimi']] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === k ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            {tab === 'termine' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Menaxhimi i Termineve</h2>
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus className="size-4" />
                    <span>Shto Termin</span>
                  </button>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pacienti</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Mjeku</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data · Ora</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Veprime</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {appointments.map((a) => (
                          <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3">
                              <button
                                onClick={() => {
                                  const p = MOCK_PATIENTS.find((p) => p.name === a.patientName)
                                  if (p) setSelectedPatient(p)
                                }}
                                className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left"
                              >
                                {a.patientName}
                              </button>
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctorName}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{a.date} · {a.time}</td>
                            <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors">
                                  <Edit2 className="size-3.5" />
                                </button>
                                {a.status !== 'anuluar' && (
                                  <button onClick={() => cancelAppt(a.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                                    <X className="size-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {tab === 'faturim' && (
              <>
                <h2 className="font-semibold text-foreground">Faturim i Shpejtë</h2>
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pacienti</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Shërbimi</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shuma</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Veprime</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {MOCK_PAYMENTS.map((p) => (
                          <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-foreground">{p.patientName}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{p.service}</td>
                            <td className="px-4 py-3 text-sm font-bold text-foreground">{p.amount.toLocaleString()} L</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3 text-right">
                              {p.status !== 'paguar' && (
                                <button className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors border border-green-200">
                                  Shëno Paguar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Calendar sidebar */}
          <div>
            <h2 className="font-semibold text-foreground mb-3">Kalendari i Klinikës</h2>
            <CalendarWidget />

            {/* Quick patient list */}
            <div className="mt-4">
              <h3 className="font-medium text-foreground text-sm mb-2">Pacientë të Regjistruar</h3>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {MOCK_PATIENTS.slice(0, 4).map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left ${i !== 0 ? 'border-t border-border' : ''}`}
                  >
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.age} vjeç</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}
      {selectedPatient && <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
    </div>
  )
}
