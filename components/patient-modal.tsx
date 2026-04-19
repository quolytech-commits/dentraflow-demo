'use client'

import { useState } from 'react'
import { X, User, Phone, Mail, Calendar, FileText, ChevronRight } from 'lucide-react'
import { Patient, MOCK_DOCTORS } from '@/lib/mock-data'
import { StatusBadge } from './status-badge'

interface PatientModalProps {
  patient: Patient | null
  onClose: () => void
}

function AddAppointmentInline({ patientName, onCancel, onDone }: { patientName: string; onCancel: () => void; onDone: () => void }) {
  const [form, setForm] = useState({ doctor: '', date: '', time: '', type: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
    setTimeout(onDone, 1000)
  }

  if (saved) {
    return (
      <div className="p-4 text-center space-y-2">
        <div className="size-10 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Calendar className="size-5 text-green-600" />
        </div>
        <p className="text-sm font-semibold text-foreground">Termini u shtua!</p>
        <p className="text-xs text-muted-foreground">Termini për {patientName} u regjistrua me sukses.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 border-t border-border bg-secondary/30">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shto Termin për {patientName}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Mjeku</label>
          <select required value={form.doctor} onChange={(e) => update('doctor', e.target.value)} className="w-full px-2.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs outline-none focus:border-accent transition-all">
            <option value="">Zgjedh mjekun...</option>
            {MOCK_DOCTORS.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Lloji</label>
          <select required value={form.type} onChange={(e) => update('type', e.target.value)} className="w-full px-2.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs outline-none focus:border-accent transition-all">
            <option value="">Zgjedh llojin...</option>
            {['Kontroll', 'Mbushje', 'Ekstraksion', 'Pastrimi', 'Zbardhim', 'Implant', 'Protezë'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Data</label>
          <input type="date" required value={form.date} onChange={(e) => update('date', e.target.value)} className="w-full px-2.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs outline-none focus:border-accent transition-all" />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Ora</label>
          <input type="time" required value={form.time} onChange={(e) => update('time', e.target.value)} className="w-full px-2.5 py-2 rounded-lg border border-border bg-card text-foreground text-xs outline-none focus:border-accent transition-all" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-60">
          {saving ? 'Duke ruajtur...' : 'Ruaj Terminin'}
        </button>
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded-lg border border-border text-foreground text-xs hover:bg-secondary transition-colors">Anulo</button>
      </div>
    </form>
  )
}

export function PatientModal({ patient, onClose }: PatientModalProps) {
  const [tab, setTab] = useState<'info' | 'history' | 'notes' | 'treatments'>('info')
  const [showAddAppt, setShowAddAppt] = useState(false)

  if (!patient) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-border">
          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="size-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-foreground font-bold text-lg">{patient.name}</h2>
              <StatusBadge status={patient.status} />
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">{patient.age} vjeç · {patient.doctor}</p>
          </div>
          <button onClick={onClose} className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-5 overflow-x-auto">
          {([
            { key: 'info', label: 'Informacion' },
            { key: 'history', label: 'Historiku' },
            { key: 'notes', label: 'Shënime' },
            { key: 'treatments', label: 'Trajtimet' },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${tab === t.key ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-h-72 overflow-y-auto">
          {tab === 'info' && (
            <div className="space-y-3">
              <InfoRow icon={Phone} label="Telefon" value={patient.phone} />
              <InfoRow icon={Mail} label="Email" value={patient.email} />
              <InfoRow icon={Calendar} label="Vizita e fundit" value={patient.lastVisit} />
            </div>
          )}
          {tab === 'treatments' && (
            <div className="space-y-2">
              {patient.treatments.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-6">Nuk ka trajtime të regjistruara.</p>
              ) : (
                patient.treatments.map((t) => (
                  <div key={t} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <ChevronRight className="size-4 text-accent flex-shrink-0" />
                    <p className="text-sm font-medium text-foreground">{t}</p>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'history' && (
            <div className="space-y-2">
              {patient.medicalHistory.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-6">Nuk ka historik mjekësor të regjistruar.</p>
              ) : (
                patient.medicalHistory.map((h) => (
                  <div key={h} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                    <span className="size-2 rounded-full bg-accent flex-shrink-0" />
                    <p className="text-sm text-foreground">{h}</p>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'notes' && (
            <div className="p-3 bg-secondary rounded-xl">
              <div className="flex items-start gap-2">
                <FileText className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">{patient.notes || 'Nuk ka shënime.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Inline add appointment form */}
        {showAddAppt && (
          <AddAppointmentInline
            patientName={patient.name}
            onCancel={() => setShowAddAppt(false)}
            onDone={() => { setShowAddAppt(false) }}
          />
        )}

        {/* Footer */}
        {!showAddAppt && (
          <div className="flex gap-2 p-4 border-t border-border">
            <button
              onClick={() => setShowAddAppt(true)}
              className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Shto Termin
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">
              Mbyll
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
      <Icon className="size-4 text-muted-foreground flex-shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
