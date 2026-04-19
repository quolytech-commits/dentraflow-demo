'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { MOCK_DOCTORS, MOCK_PATIENTS } from '@/lib/mock-data'

interface AppointmentModalProps {
  onClose: () => void
  onSave?: (data: Record<string, string>) => void
}

export function AppointmentModal({ onClose, onSave }: AppointmentModalProps) {
  const [form, setForm] = useState({ patient: '', doctor: '', date: '', time: '', type: '', notes: '' })
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => {
      onSave?.(form)
      onClose()
    }, 800)
  }

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground">Shto Termin të Ri</h2>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Pacienti</label>
            <select
              required
              value={form.patient}
              onChange={(e) => update('patient', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            >
              <option value="">Zgjedh pacientin...</option>
              {MOCK_PATIENTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Mjeku</label>
            <select
              required
              value={form.doctor}
              onChange={(e) => update('doctor', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            >
              <option value="">Zgjedh mjekun...</option>
              {MOCK_DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Data</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Ora</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Lloji i Trajtimit</label>
            <select
              required
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            >
              <option value="">Zgjedh llojin...</option>
              {['Kontroll', 'Mbushje', 'Ekstraksion', 'Pastrimi', 'Zbardhim', 'Implant', 'Protezë', 'Ortodonci'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Shënime (opsionale)</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Shënime shtesë..."
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saved}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saved ? 'Duke ruajtur...' : 'Ruaj Terminin'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
            >
              Anulo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
