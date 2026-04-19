'use client'

import { useState } from 'react'
import { Plus, Edit2, X } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { AppointmentModal } from '@/components/appointment-modal'
import { MOCK_APPOINTMENTS, Appointment } from '@/lib/mock-data'

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [showModal, setShowModal] = useState(false)

  const cancel = (id: string) => {
    setAppointments(appointments.map((a) => a.id === id ? { ...a, status: 'anuluar' as const } : a))
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Menaxhimi i Termineve" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{appointments.length} termine gjithsej</p>
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
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Lloji</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Veprime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{a.patientName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctorName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{a.date} · {a.time}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{a.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"><Edit2 className="size-3.5" /></button>
                        {a.status !== 'anuluar' && (
                          <button onClick={() => cancel(a.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"><X className="size-3.5" /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
