'use client'

import { useState } from 'react'
import { Topbar } from '@/components/topbar'
import { StatusBadge } from '@/components/status-badge'
import { StatCard } from '@/components/stat-card'
import { CreditCard, TrendingUp } from 'lucide-react'
import { MOCK_PAYMENTS } from '@/lib/mock-data'

export default function BillingPage() {
  const [payments, setPayments] = useState(MOCK_PAYMENTS)

  const markPaid = (id: string) => {
    setPayments(payments.map((p) => p.id === id ? { ...p, status: 'paguar' as const } : p))
  }

  const paid = payments.filter((p) => p.status === 'paguar').reduce((s, p) => s + p.amount, 0)
  const unpaidAmt = payments.filter((p) => p.status !== 'paguar').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Faturimi" />
      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Të Ardhura" value={`${(paid / 1000).toFixed(0)}K L`} subtext="Pagesa të mbledhura" icon={TrendingUp} iconBg="bg-green-50" iconColor="text-green-600" />
          <StatCard label="Papaguar" value={`${(unpaidAmt / 1000).toFixed(0)}K L`} subtext="Kërkojnë arkëtim" icon={CreditCard} iconBg="bg-red-50" iconColor="text-red-500" />
        </div>

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
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.patientName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{p.service}</td>
                    <td className="px-4 py-3 text-sm font-bold text-foreground">{p.amount.toLocaleString()} L</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {p.status !== 'paguar' && (
                        <button onClick={() => markPaid(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors border border-green-200">
                          Shëno Paguar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
