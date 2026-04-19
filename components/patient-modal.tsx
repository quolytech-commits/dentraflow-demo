'use client'

import { useState } from 'react'
import { X, User, Phone, Mail, Calendar, FileText } from 'lucide-react'
import { Patient } from '@/lib/mock-data'
import { StatusBadge } from './status-badge'

interface PatientModalProps {
  patient: Patient | null
  onClose: () => void
}

export function PatientModal({ patient, onClose }: PatientModalProps) {
  const [tab, setTab] = useState<'info' | 'history' | 'notes'>('info')
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
        <div className="flex border-b border-border px-5">
          {(['info', 'history', 'notes'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t === 'info' ? 'Informacion' : t === 'history' ? 'Historiku' : 'Shënime'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 max-h-80 overflow-y-auto">
          {tab === 'info' && (
            <div className="space-y-3">
              <InfoRow icon={Phone} label="Telefon" value={patient.phone} />
              <InfoRow icon={Mail} label="Email" value={patient.email} />
              <InfoRow icon={Calendar} label="Vizita e fundit" value={patient.lastVisit} />
              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Trajtimet</p>
                <div className="flex flex-wrap gap-2">
                  {patient.treatments.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-secondary text-foreground text-xs font-medium border border-border">{t}</span>
                  ))}
                </div>
              </div>
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

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-border">
          <button className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            Shto Termin
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors">
            Mbyll
          </button>
        </div>
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
