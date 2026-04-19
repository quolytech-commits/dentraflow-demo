'use client'

import { FileText, Download } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatCard } from '@/components/stat-card'
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_PAYMENTS } from '@/lib/mock-data'

const REPORTS = [
  { id: 'r1', title: 'Raporti Mujor i Terminevedhe', date: '2026-04-01', type: 'Termin', size: '124 KB' },
  { id: 'r2', title: 'Bilanci Financiar — Prill 2026', date: '2026-04-15', type: 'Financiar', size: '89 KB' },
  { id: 'r3', title: 'Statistikat e Pacientëve Q1 2026', date: '2026-03-31', type: 'Pacientë', size: '245 KB' },
  { id: 'r4', title: 'Performanca e Mjekëve — Mars 2026', date: '2026-03-31', type: 'Performancë', size: '156 KB' },
]

export default function AdminReportsPage() {
  const revenue = MOCK_PAYMENTS.filter((p) => p.status === 'paguar').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Raportet" />
      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Pacientë Total" value={String(MOCK_PATIENTS.length)} icon={FileText} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Termine Total" value={String(MOCK_APPOINTMENTS.length)} icon={FileText} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <StatCard label="Të Ardhura" value={`${(revenue / 1000).toFixed(0)}K L`} icon={FileText} iconBg="bg-green-50" iconColor="text-green-600" />
        </div>

        <div>
          <h2 className="font-semibold text-foreground mb-3">Raportet e Gjeneruara</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
            {REPORTS.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-4 py-4 hover:bg-secondary/30 transition-colors">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.date} · {r.size}</p>
                </div>
                <span className="hidden sm:block text-xs px-2 py-1 rounded-lg bg-secondary border border-border text-muted-foreground">{r.type}</span>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                  <Download className="size-3.5" />
                  <span className="hidden sm:block">Shkarko</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
