'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Plus, Edit2, X, AlertCircle } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { fetcher, api } from '@/lib/api-client'
import { Appointment, Patient, Doctor } from '@/lib/mock-data'

const TREATMENT_TYPES = ['Kontroll', 'Mbushje', 'Ekstraksion', 'Pastrimi', 'Zbardhim', 'Implant', 'Protezë', 'Ortodonci']

function EditModal({ appointment, patients, doctors, onClose, onSave }: {
  appointment: Appointment; patients: Patient[]; doctors: Doctor[]
  onClose: () => void; onSave: () => void
}) {
  const [form, setForm] = useState({
    patientId: appointment.patientId ?? '',
    doctorId: appointment.doctorId ?? '',
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    status: appointment.status,
  })
  const [saving, setSaving] = useState(false)
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await api.put(`/api/appointments/${appointment.id}`, form)
    setSaving(false)
    onSave()
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
              <select required value={form.patientId} onChange={(e) => update('patientId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku</label>
              <select required value={form.doctorId} onChange={(e) => update('doctorId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
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
              {TREATMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
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
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {saving ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddModal({ patients, doctors, onClose, onSave }: {
  patients: Patient[]; doctors: Doctor[]
  onClose: () => void; onSave: () => void
}) {
  const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', time: '', type: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/api/appointments', form)
      onSave()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gabim gjatë ruajtjes.')
    } finally {
      setSaving(false)
    }
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
          {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Pacienti</label>
            <select required value={form.patientId} onChange={(e) => update('patientId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
              <option value="">Zgjedh pacientin...</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku</label>
            <select required value={form.doctorId} onChange={(e) => update('doctorId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
              <option value="">Zgjedh mjekun...</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
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
              {TREATMENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
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
  const [showAdd, setShowAdd] = useState(false)
  const [editAppt, setEditAppt] = useState<Appointment | null>(null)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  const { data: appointments = [], mutate } = useSWR<Appointment[]>('/api/appointments', fetcher, { refreshInterval: 15000 })
  const { data: patients = [] } = useSWR<Patient[]>('/api/patients', fetcher)
  const { data: doctors = [] } = useSWR<Doctor[]>('/api/users?role=mjek', fetcher)

  const cancel = async (id: string) => {
    await api.put(`/api/appointments/${id}`, { status: 'anuluar' })
    setConfirmCancel(null)
    mutate()
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Menaxhimi i Termineve" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{appointments.length} termine gjithsej</p>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]">
            <Plus className="size-4" /><span>Shto Termin</span>
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
                {appointments.map((a: Appointment) => (
                  <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{a.patientName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctorName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{a.date} · {a.time}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{a.type}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {a.status !== 'anuluar' && (
                          <button onClick={() => setEditAppt(a)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" title="Ndrysho"><Edit2 className="size-3.5" /></button>
                        )}
                        {a.status !== 'anuluar' && a.status !== 'perfunduar' && (
                          <button onClick={() => setConfirmCancel(a.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Anulo"><X className="size-3.5" /></button>
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

      {showAdd && <AddModal patients={patients} doctors={doctors} onClose={() => setShowAdd(false)} onSave={() => mutate()} />}
      {editAppt && <EditModal appointment={editAppt} patients={patients} doctors={doctors} onClose={() => setEditAppt(null)} onSave={() => mutate()} />}
    </div>
  )
}
