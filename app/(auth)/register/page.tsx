'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Stethoscope, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'recepsion' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) {
      setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Fjalëkalimet nuk përputhen.')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="size-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="size-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Regjistrimi u dërgua!</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Kërkesa juaj u dërgua për aprovim. Do të njoftoheni kur llogaria të aktivizohet.
          </p>
          <Link href="/login" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            Kthehu te Hyrja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="size-5 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">DentraFlow</span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Krijo Llogari</h1>
          <p className="text-muted-foreground mt-1 text-sm">Plotësoni të dhënat për t&apos;u regjistruar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Emri i plotë</label>
            <input
              required value={form.name} onChange={(e) => update('name', e.target.value)}
              placeholder="Emri Mbiemri"
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email" required value={form.email} onChange={(e) => update('email', e.target.value)}
              placeholder="email@klinika.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Roli</label>
            <select
              value={form.role} onChange={(e) => update('role', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            >
              <option value="mjek">Mjek</option>
              <option value="recepsion">Recepsion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Fjalëkalimi</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)}
                placeholder="Min. 8 karaktere"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Konfirmo Fjalëkalimin</label>
            <input
              type="password" required value={form.confirm} onChange={(e) => update('confirm', e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="size-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Duke regjistruar...</span></> : <><span>Regjistrohu</span><ArrowRight className="size-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Keni llogari?{' '}
          <Link href="/login" className="text-accent font-medium hover:underline">Hyrje</Link>
        </p>
      </div>
    </div>
  )
}
