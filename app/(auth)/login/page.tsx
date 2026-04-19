'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Stethoscope, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Gabim gjatë hyrjes.')
      return
    }
    // Redirect based on stored user role
    const stored = sessionStorage.getItem('dentraflow_user')
    if (stored) {
      const user = JSON.parse(stored)
      if (user.role === 'admin') router.push('/dashboard/admin')
      else if (user.role === 'mjek') router.push('/dashboard/mjek')
      else router.push('/dashboard/recepsion')
    }
  }

  const fillCredentials = (role: 'admin' | 'mjek' | 'recepsion') => {
    const creds = {
      admin: { email: 'admin@dentraflow.com', password: 'admin123' },
      mjek: { email: 'mjek@dentraflow.com', password: 'mjek123' },
      recepsion: { email: 'recepsion@dentraflow.com', password: 'recepsion123' },
    }
    setEmail(creds[role].email)
    setPassword(creds[role].password)
    setError('')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[420px] bg-[oklch(0.18_0.04_248)] p-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-accent flex items-center justify-center">
            <Stethoscope className="size-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">DentraFlow</span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-white text-3xl font-bold leading-tight text-pretty">
            Menaxhoni klinikën tuaj me efikasitet maksimal
          </h2>
          <p className="text-white/60 mt-4 leading-relaxed text-sm">
            Platforma premium e menaxhimit dentar. Terminet, pacientët dhe financat — gjithçka në një vend.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { text: 'Menaxhim i plotë i terminevedhe pacientëve' },
              { text: 'Raporte financiare në kohë reale' },
              { text: 'Akses i bazuar në rolin e përdoruesit' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                  <div className="size-2 rounded-full bg-accent" />
                </div>
                <p className="text-white/70 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs">© 2026 DentraFlow. Të gjitha të drejtat e rezervuara.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
              <Stethoscope className="size-5 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">DentraFlow</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Mirë se vini</h1>
            <p className="text-muted-foreground mt-1 text-sm">Hyni në llogarinë tuaj për të vazhduar</p>
          </div>

          {/* Quick login chips */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Hyrje e shpejtë (demo)</p>
            <div className="flex flex-wrap gap-2">
              {[
                { role: 'admin' as const, label: 'Super Admin' },
                { role: 'mjek' as const, label: 'Mjek' },
                { role: 'recepsion' as const, label: 'Recepsion' },
              ].map((c) => (
                <button
                  key={c.role}
                  onClick={() => fillCredentials(c.role)}
                  className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-medium text-foreground hover:bg-muted hover:border-accent/50 transition-all"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@dentraflow.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Fjalëkalimi</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                Harrova fjalëkalimin
              </Link>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="size-4 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Duke hyrë...</span>
                </>
              ) : (
                <>
                  <span>Hyrje</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Nuk keni llogari?{' '}
            <Link href="/register" className="text-accent font-medium hover:underline">
              Regjistrohu
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
