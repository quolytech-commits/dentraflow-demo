'use client'

import { useState } from 'react'
import { Plus, Edit2, X, AlertCircle } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS, Appointment } from '@/lib/mock-data'

type AppStatus = 'ne-pritje' | 'ne-trajtim' | 'perfunduar' | 'anuluar'

function EditModal({ appointment, onClose, onSave }: { appointment: Appointment; onClose: () => void; onSave: (a: Appointment) => void }) {
  const [form, setForm] = useState({
    patientName: appointment.patientName,
    doctorName: appointment.doctorName,
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    status: appointment.status as AppStatus,
  })
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ ...appointment, ...form, status: form.status as AppStatus })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">Ndrysho Terminin</h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="size-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Pacienti</label>
              <select required value={form.patientName} onChange={(e) => update('patientName', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
                {MOCK_PATIENTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku</label>
              <select required value={form.doctorName} onChange={(e) => update('doctorName', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
                {MOCK_DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Data</label>
              <input type="date" required value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Ora</label>
              <input type="time" required value={form.time} onChange={(e) => update('time', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Lloji</label>
            <select required value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
              {['Kontroll', 'Mbushje', 'Ekstraksion', 'Pastrimi', 'Zbardhim', 'Implant', 'Protezë', 'Ortodonci'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Statusi</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
              <option value="ne-pritje">Në Pritje</option>
              <option value="ne-trajtim">Në Trajtim</option>
              <option value="perfunduar">Përfunduar</option>
              <option value="anuluar">Anuluar</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">Ruaj Ndryshimet</button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Appointment) => void }) {
  const [form, setForm] = useState({ patient: '', doctor: '', date: '', time: '', type: '' })
  const [saving, setSaving] = useState(false)
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    onSave({ id: `a${Date.now()}`, patientName: form.patient, doctorName: form.doctor, date: form.date, time: form.time, type: form.type, status: 'ne-pritje' })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">Shto Termin të Ri</h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="size-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Pacienti</label>
            <select required value={form.patient} onChange={(e) => update('patient', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
              <option value="">Zgjedh pacientin...</option>
              {MOCK_PATIENTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku</label>
            <select required value={form.doctor} onChange={(e) => update('doctor', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
              <option value="">Zgjedh mjekun...</option>
              {MOCK_DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Data</label>
              <input type="date" required value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Ora</label>
              <input type="time" required value={form.time} onChange={(e) => update('time', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Lloji i Trajtimit</label>
            <select required value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
              <option value="">Zgjedh llojin...</option>
              {['Kontroll', 'Mbushje', 'Ekstraksion', 'Pastrimi', 'Zbardhim', 'Implant', 'Protezë', 'Ortodonci'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {saving ? 'Duke ruajtur...' : 'Ruaj Terminin'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [showAdd, setShowAdd] = useState(false)
  const [editAppt, setEditAppt] = useState<Appointment | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  const cancel = (id: string) => {
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'anuluar' as const } : a))
    setConfirmCancel(null)
  }

  const saveEdit = (updated: Appointment) => {
    setAppointments((prev) => prev.map((a) => a.id === updated.id ? updated : a))
  }

  const addAppt = (appt: Appointment) => {
    setAppointments((prev) => [appt, ...prev])
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Menaxhimi i Termineve" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{appointments.length} termine gjithsej</p>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
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
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{a.date} · {a.time}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{a.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {a.status !== 'anuluar' && (
                          <button onClick={() => setEditAppt(a)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" title="Ndrysho">
                            <Edit2 className="size-3.5" />
                          </button>
                        )}
                        {a.status !== 'anuluar' && a.status !== 'perfunduar' && (
                          <button onClick={() => setConfirmCancel(a.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Anulo">
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
      </div>

      {/* Cancel confirmation */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmCancel(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center"><AlertCircle className="size-5 text-red-600" /></div>
              <div>
                <h3 className="font-bold text-foreground">Anulo Terminin?</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Kjo veprim nuk mund të kthehe mbrapsht.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => cancel(confirmCancel)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Anulo Terminin</button>
              <button onClick={() => setConfirmCancel(null)} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Mbyll</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={addAppt} />}
      {editAppt && <EditModal appointment={editAppt} onClose={() => setEditAppt(null)} onSave={saveEdit} />}
    </div>
  )
}
