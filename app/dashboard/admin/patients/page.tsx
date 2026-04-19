'use client'

import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { PatientModal } from '@/components/patient-modal'
import { MOCK_PATIENTS, Patient } from '@/lib/mock-data'

export default function AdminPatientsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selected, setSelected] = useState<Patient | null>(null)

  const filtered = MOCK_PATIENTS.filter((p) =>
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'all' || p.status === statusFilter)
  )

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Pacientët" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-secondary">
            <Search className="size-4 text-muted-foreground flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko pacientë ose mjekë..."
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-52"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-border bg-secondary text-sm text-foreground outline-none"
          >
            <option value="all">Të gjithë statuset</option>
            <option value="ne-pritje">Në Pritje</option>
            <option value="ne-trajtim">Në Trajtim</option>
            <option value="perfunduar">Përfunduar</option>
          </select>
          <span className="text-sm text-muted-foreground">{filtered.length} pacientë</span>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-12 text-center">
            <Users className="size-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-foreground font-medium">Nuk u gjetën pacientë</p>
            <p className="text-muted-foreground text-sm mt-1">Provoni të ndryshoni filtrat e kërkimit</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pacienti</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Mosha</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Mjeku</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Vizita e Fundit</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelected(p)}
                      className="hover:bg-secondary/30 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                            {p.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{p.age} vjeç</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{p.doctor}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{p.lastVisit}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
