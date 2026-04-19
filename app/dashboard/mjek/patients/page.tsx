'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { PatientModal } from '@/components/patient-modal'
import { useAuth } from '@/lib/auth-context'
import { MOCK_PATIENTS, Patient } from '@/lib/mock-data'

export default function DoctorPatientsPage() {
  const { user } = useAuth()
  const doctorName = user?.name ?? 'Dr. Andi Hoxha'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Patient | null>(null)

  const myPatients = MOCK_PATIENTS.filter((p) =>
    p.doctor === doctorName &&
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || p.status === statusFilter)
  )

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Pacientët e Mi" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary">
            <Search className="size-4 text-muted-foreground flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko pacient..."
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
          <span className="text-sm text-muted-foreground">{myPatients.length} pacientë</span>
        </div>

        {myPatients.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Search className="size-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-foreground font-medium">Nuk u gjetën pacientë</p>
            <p className="text-muted-foreground text-sm mt-1">Provoni të ndryshoni filtrat e kërkimit</p>
          </div>
        ) : (
          <div className="space-y-2">
            {myPatients.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md hover:border-accent/30 transition-all text-left"
              >
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {p.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{p.name}</p>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{p.age} vjeç · {p.phone}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground">Vizita e fundit</p>
                  <p className="text-sm font-medium text-foreground">{p.lastVisit}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
