'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Search, UserPlus, Users, X } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { PatientModal } from '@/components/patient-modal'
import { fetcher, api } from '@/lib/api-client'
import { Patient, Doctor } from '@/lib/mock-data'

function AddPatientModal({ doctors, onClose, onSave }: { doctors: Doctor[]; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({ name: '', age: '', phone: '', email: '', doctorId: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await api.post('/api/patients', { ...form, age: form.age ? Number(form.age) : undefined })
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
          <h2 className="font-bold text-foreground">Shto Pacient të Ri</h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="size-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Emri i plotë *</label>
              <input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="p.sh. Arta Berisha" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mosha</label>
              <input type="number" min="0" max="120" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="vjeç" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Telefoni</label>
              <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+355 69..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="email@shembull.com" className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku kryesor</label>
              <select value={form.doctorId} onChange={(e) => update('doctorId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all">
                <option value="">Zgjedh mjekun...</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Shënime</label>
              <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="Shënime shtesë..." className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60">
              {saving ? 'Duke ruajtur...' : 'Shto Pacientin'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function RecepsionPatientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Patient | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const { data: patients = [], mutate } = useSWR<Patient[]>(
    `/api/patients?search=${encodeURIComponent(search)}&status=${statusFilter}`,
    fetcher,
    { refreshInterval: 15000 }
  )
  const { data: doctors = [] } = useSWR<Doctor[]>('/api/users?role=mjek', fetcher)

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Pacientët" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-3 justify-between flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko pacientë..."
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-44"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-border bg-secondary text-sm text-foreground outline-none"
            >
              <option value="all">Të gjithë</option>
              <option value="ne-pritje">Në Pritje</option>
              <option value="ne-trajtim">Në Trajtim</option>
              <option value="perfunduar">Përfunduar</option>
            </select>
            <span className="text-sm text-muted-foreground">{patients.length} pacientë</span>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            <UserPlus className="size-4" />
            <span>Pacient i Ri</span>
          </button>
        </div>

        {patients.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Users className="size-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-foreground font-medium">Nuk u gjetën pacientë</p>
            <p className="text-muted-foreground text-sm mt-1">Provoni të ndryshoni filtrat e kërkimit</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((p: Patient) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-accent/30 transition-all text-left active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.age} vjeç · {p.doctor}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge status={p.status} />
                  <span className="text-xs text-muted-foreground">{p.lastVisit}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} onMutate={mutate} />}
      {showAdd && <AddPatientModal doctors={doctors} onClose={() => setShowAdd(false)} onSave={() => mutate()} />}
    </div>
  )
}
