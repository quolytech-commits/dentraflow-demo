'use client'

import { useState } from 'react'
import { UserPlus, Trash2 } from 'lucide-react'
import { Topbar } from '@/components/topbar'
import { MOCK_DOCTORS, User } from '@/lib/mock-data'

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<User[]>(MOCK_DOCTORS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', specialty: '', email: '' })

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    setDoctors([...doctors, {
      id: `d${Date.now()}`,
      name: `Dr. ${form.name}`,
      email: form.email || `${form.name.toLowerCase().replace(/\s/g, '.')}@dentraflow.com`,
      role: 'mjek',
      avatar: form.name.slice(0, 2).toUpperCase(),
      specialty: form.specialty || 'Stomatologji',
    }])
    setForm({ name: '', specialty: '', email: '' })
    setShowForm(false)
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar title="Menaxhimi i Mjekëve" />
      <div className="flex-1 p-4 lg:p-6 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{doctors.length} mjekë gjithsej</p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <UserPlus className="size-4" />
            <span>Shto Mjek</span>
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Mjek i Ri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Emri Mbiemri" className="px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
              <input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Specializimi" className="px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (opsional)" className="px-3 py-2.5 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent transition-all" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Shto Mjekun</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-border text-foreground text-sm hover:bg-secondary transition-colors">Anulo</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {doc.avatar}
                </div>
                <button
                  onClick={() => setDoctors(doctors.filter((d) => d.id !== doc.id))}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="mt-3">
                <p className="font-semibold text-foreground">{doc.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{doc.specialty}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.email}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 font-medium">Aktiv</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
