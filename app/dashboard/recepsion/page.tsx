'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Calendar, CreditCard, Plus, Edit2, X, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CalendarWidget } from '@/components/calendar-widget'
import { PatientModal } from '@/components/patient-modal'
import { fetcher, api } from '@/lib/api-client'
import { Patient, Appointment, Payment, Doctor } from '@/lib/mock-data'

type AppStatus = 'ne-pritje' | 'ne-trajtim' | 'perfunduar' | 'anuluar'

const TREATMENT_TYPES = ['Kontroll', 'Mbushje', 'Ekstraksion', 'Pastrimi', 'Zbardhim', 'Implant', 'Protezë', 'Ortodonci']

function EditAppointmentModal({ appointment, patients, doctors, onClose, onSave }: {
  appointment: Appointment; patients: Patient[]; doctors: Doctor[]
  onClose: () => void; onSave: (updated: Appointment) => Promise<void>
}) {
  const [form, setForm] = useState({
    patientId: appointment.patientId ?? '',
    doctorId: appointment.doctorId ?? '',
    date: appointment.date,
    time: appointment.time,
    type: appointment.type,
    status: appointment.status as AppStatus,
  })
  const [saving, setSaving] = useState(false)
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({ ...appointment, ...form, status: form.status })
    setSaving(false)
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
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Pacienti</label>
            <select required value={form.patientId} onChange={(e) => update('patientId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku</label>
            <select required value={form.doctorId} onChange={(e) => update('doctorId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all">
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
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60">
              {saving ? 'Duke ruajtur...' : 'Ruaj Ndryshimet'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">Anulo</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddAppointmentModal({ patients, doctors, onClose, onSave }: {
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
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {saving ? 'Duke ruajtur...' : 'Ruaj Terminin'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">Anulo</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ReceptionDashboard() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [tab, setTab] = useState<'termine' | 'faturim'>('termine')
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]

  const { data: appointments = [], mutate: mutateAppts } = useSWR<Appointment[]>('/api/appointments', fetcher, { refreshInterval: 15000 })
  const { data: payments = [], mutate: mutatePayments } = useSWR<Payment[]>('/api/payments', fetcher, { refreshInterval: 15000 })
  const { data: patients = [], mutate: mutatePatients } = useSWR<Patient[]>('/api/patients', fetcher, { refreshInterval: 30000 })
  const { data: doctors = [] } = useSWR<Doctor[]>('/api/users?role=mjek', fetcher)

  const todayAppts = appointments.filter((a: Appointment) => a.date === today)
  const pending = appointments.filter((a: Appointment) => a.status === 'ne-pritje').length
  const done = appointments.filter((a: Appointment) => a.status === 'perfunduar').length
  const unpaid = payments.filter((p: Payment) => p.status === 'papaguar').length

  const cancelAppt = async (id: string) => {
    await api.put(`/api/appointments/${id}`, { status: 'anuluar' })
    setConfirmCancel(null)
    mutateAppts()
  }

  const saveEdit = async (updated: Appointment) => {
    await api.put(`/api/appointments/${updated.id}`, {
      patientId: updated.patientId,
      doctorId: updated.doctorId,
      date: updated.date,
      time: updated.time,
      type: updated.type,
      status: updated.status,
    })
    mutateAppts()
  }

  const markPaid = async (id: string) => {
    await api.put(`/api/payments/${id}`, { status: 'paguar' })
    mutatePayments()
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
                <button key={k} onClick={() => setTab(k)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === k ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{l}</button>
              ))}
            </div>

            {tab === 'termine' && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Menaxhimi i Termineve</h2>
                  <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]">
                    <Plus className="size-4" /><span>Shto Termin</span>
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <Calendar className="size-10 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-foreground font-medium">Nuk ka termine</p>
                    <p className="text-muted-foreground text-sm mt-1">Shtoni terminin e parë duke klikuar butonin lart</p>
                  </div>
                ) : (
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
                              <td className="px-4 py-3">
                                <button onClick={() => { const p = patients.find((p: Patient) => p.id === a.patientId); if (p) setSelectedPatient(p) }} className="text-sm font-medium text-foreground hover:text-accent transition-colors text-left">
                                  {a.patientName}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctorName}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{a.date} · {a.time}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{a.type}</td>
                              <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                  {a.status !== 'anuluar' && (
                                    <button onClick={() => setEditingAppt(a)} className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors" title="Ndrysho"><Edit2 className="size-3.5" /></button>
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
                )}
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
                        {payments.map((p: Payment) => (
                          <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-foreground">{p.patientName}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{p.service}</td>
                            <td className="px-4 py-3 text-sm font-bold text-foreground">{p.amount.toLocaleString()} L</td>
                            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                            <td className="px-4 py-3 text-right">
                              {p.status !== 'paguar' && (
                                <button onClick={() => markPaid(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors border border-green-200 active:scale-95">Shëno Paguar</button>
                              )}
                              {p.status === 'paguar' && <span className="text-xs text-muted-foreground">Paguar</span>}
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
            <CalendarWidget appointments={appointments} />

            <div className="mt-4">
              <h3 className="font-medium text-foreground text-sm mb-2">Pacientë të Regjistruar</h3>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                {patients.slice(0, 4).map((p: Patient, i: number) => (
                  <button key={p.id} onClick={() => setSelectedPatient(p)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left ${i !== 0 ? 'border-t border-border' : ''}`}>
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">{p.name.slice(0, 2).toUpperCase()}</div>
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

      {/* Cancel confirmation */}
      {confirmCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmCancel(null)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0"><AlertCircle className="size-5 text-red-600" /></div>
              <div>
                <h3 className="font-bold text-foreground">Anulo Terminin?</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Kjo veprim nuk mund të kthehe mbrapsht.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => cancelAppt(confirmCancel)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Anulo Terminin</button>
              <button onClick={() => setConfirmCancel(null)} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">Mbyll</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && <AddAppointmentModal patients={patients} doctors={doctors} onClose={() => setShowAddModal(false)} onSave={() => mutateAppts()} />}
      {editingAppt && <EditAppointmentModal appointment={editingAppt} patients={patients} doctors={doctors} onClose={() => setEditingAppt(null)} onSave={saveEdit} />}
      {selectedPatient && <PatientModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} onMutate={() => { mutatePatients(); mutateAppts() }} />}
    </div>
  )
}
