'use client'

import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { PatientModal } from '@/components/patient-modal'
import { MOCK_PATIENTS, Patient } from '@/lib/mock-data'

export default function RecepsionPatientsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Patient | null>(null)

  const filtered = MOCK_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Pacientët" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-3 justify-between flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary">
            <Search className="size-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Kërko pacientë..." className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-44" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <UserPlus className="size-4" /><span>Pacient i Ri</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setSelected(p)} className="bg-card border border-border rounded-2xl p-4 hover:shadow-md hover:border-accent/30 transition-all text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.age} vjeç</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <StatusBadge status={p.status} />
                <span className="text-xs text-muted-foreground">{p.lastVisit}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
