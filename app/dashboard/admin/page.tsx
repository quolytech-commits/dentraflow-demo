'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Users, TrendingUp, Calendar, CreditCard, UserPlus, Trash2, Star, Activity } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { CalendarWidget } from '@/components/calendar-widget'
import { fetcher, api } from '@/lib/api-client'

interface Doctor {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  specialty?: string
  patientCount?: number
}

interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  type: string
  status: string
}

interface Payment {
  id: string
  patientName: string
  amount: number
  date: string
  status: string
  service: string
}

interface Stats {
  totalPatients: number
  patientsInTreatment: number
  todayAppointments: number
  pendingAppointments: number
  totalDoctors: number
  totalRevenue: number
  totalBilled: number
  unpaidCount: number
}

export default function AdminDashboard() {
  const [showAddDoctor, setShowAddDoctor] = useState(false)
  const [newDoctorName, setNewDoctorName] = useState('')
  const [newDoctorEmail, setNewDoctorEmail] = useState('')
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState('')

  const { data: doctors = [], mutate: mutateDoctors } = useSWR<Doctor[]>('/api/users?role=mjek', fetcher, { refreshInterval: 30000 })
  const { data: appointments = [] } = useSWR<Appointment[]>('/api/appointments', fetcher, { refreshInterval: 15000 })
  const { data: payments = [], mutate: mutatePayments } = useSWR<Payment[]>('/api/payments', fetcher, { refreshInterval: 15000 })
  const { data: stats } = useSWR<Stats>('/api/stats', fetcher, { refreshInterval: 15000 })

  const markPaid = async (id: string) => {
    await api.put(`/api/payments/${id}`, { status: 'paguar' })
    mutatePayments()
  }

  const deleteDoctor = async (id: string) => {
    await api.del(`/api/users/${id}`)
    mutateDoctors()
  }

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDoctorName.trim() || !newDoctorEmail.trim()) return
    await api.post('/api/users', {
      name: `Dr. ${newDoctorName}`,
      email: newDoctorEmail,
      password: 'mjek2023',
      role: 'mjek',
      specialty: newDoctorSpecialty || 'Stomatologji e Përgjithshme',
    })
    setNewDoctorName('')
    setNewDoctorEmail('')
    setNewDoctorSpecialty('')
    setShowAddDoctor(false)
    mutateDoctors()
  }

  const totalRevenue = stats?.totalRevenue ?? 0
  const totalBilled = stats?.totalBilled ?? 0

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Paneli Kryesor — Super Admin" />

      <div className="flex-1 p-4 lg:p-6 space-y-6 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Numri i Pacientëve" value={String(stats?.totalPatients ?? '—')} subtext="Pacientë aktivë" trend={{ value: '+12% këtë muaj', positive: true }} icon={Users} iconBg="bg-blue-50" iconColor="text-blue-600" />
          <StatCard label="Të Ardhurat" value={`${(totalRevenue / 1000).toFixed(0)}K L`} subtext="Pagesa të mbledhura" trend={{ value: '+8% kundrejt muajit', positive: true }} icon={CreditCard} iconBg="bg-green-50" iconColor="text-green-600" />
          <StatCard label="Termine Sot" value={String(stats?.todayAppointments ?? '—')} subtext={`${stats?.patientsInTreatment ?? 0} në trajtim`} icon={Calendar} iconBg="bg-amber-50" iconColor="text-amber-600" />
          <StatCard label="Mjekë Aktivë" value={String(stats?.totalDoctors ?? '—')} subtext="Gjithsej specialistë" icon={Activity} iconBg="bg-purple-50" iconColor="text-purple-600" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Kalendari Global</h2>
            </div>
            <CalendarWidget appointments={appointments} />
          </div>

          {/* Doctor Performance */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Performanca e Mjekëve</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {doctors.map((doc, i) => (
                <div key={doc.id} className={`flex items-center gap-3 p-4 ${i !== 0 ? 'border-t border-border' : ''} hover:bg-secondary/30 transition-colors`}>
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {doc.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{doc.patientCount ?? 0}</p>
                    <p className="text-xs text-muted-foreground">pacientë</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-3.5 fill-current" />
                    <span className="text-xs font-semibold">{(4.5 + i * 0.1).toFixed(1)}</span>
                  </div>
                </div>
              ))}
              {doctors.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">Nuk ka mjekë ende.</div>
              )}
            </div>
          </div>
        </div>

        {/* Doctor Management */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Menaxhimi i Mjekëve</h2>
            <button
              onClick={() => setShowAddDoctor(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <UserPlus className="size-4" />
              <span>Shto Mjek</span>
            </button>
          </div>

          {showAddDoctor && (
            <form onSubmit={handleAddDoctor} className="bg-card border border-border rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
              <input
                autoFocus
                value={newDoctorName}
                onChange={(e) => setNewDoctorName(e.target.value)}
                placeholder="Emri i mjekut (pa Dr.)..."
                required
                className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <input
                value={newDoctorEmail}
                onChange={(e) => setNewDoctorEmail(e.target.value)}
                placeholder="Email..."
                required
                type="email"
                className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <input
                value={newDoctorSpecialty}
                onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                placeholder="Specializimi..."
                className="flex-1 min-w-[140px] px-3 py-2 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Shto</button>
              <button type="button" onClick={() => setShowAddDoctor(false)} className="px-4 py-2 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
            </form>
          )}

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mjeku</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Specializimi</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">{doc.avatar}</div>
                          <span className="text-sm font-medium text-foreground">{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{doc.email}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs px-2 py-1 rounded-lg bg-secondary border border-border text-foreground">{doc.specialty || 'Stomatologji'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteDoctor(doc.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Terminet e Fundit</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pacienti</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Mjeku</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Data &amp; Ora</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Lloji</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{a.patientName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{a.doctorName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{a.date} · {a.time}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{a.type}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Financial Panel */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Paneli Financiar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <StatCard label="Pagesat Totale" value={`${(totalBilled / 1000).toFixed(0)}K L`} icon={CreditCard} iconBg="bg-blue-50" iconColor="text-blue-600" />
            <StatCard label="Bilanci i Arkës" value={`${(totalRevenue / 1000).toFixed(0)}K L`} subtext="Pagesa të mbledhura" icon={TrendingUp} iconBg="bg-green-50" iconColor="text-green-600" />
            <StatCard label="Fatura Papaguara" value={String(stats?.unpaidCount ?? 0)} subtext="Kërkojnë ndjekje" icon={Users} iconBg="bg-red-50" iconColor="text-red-500" />
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pacienti</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Shërbimi</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shuma</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Data</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statusi</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Veprime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{p.patientName}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{p.service}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">{p.amount.toLocaleString()} L</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{p.date}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3 text-right">
                        {p.status !== 'paguar' ? (
                          <button onClick={() => markPaid(p.id)} className="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 font-medium transition-colors border border-green-200 active:scale-95">Shëno Paguar</button>
                        ) : (
                          <span className="text-xs text-muted-foreground">Paguar</span>
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
    </div>
  )
}
