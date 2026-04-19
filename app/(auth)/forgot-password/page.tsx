'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Stethoscope, ArrowRight, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center">
            <Stethoscope className="size-5 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">DentraFlow</span>
        </div>

        {!sent ? (
          <>
            <div className="mb-8">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="size-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Harrova Fjalëkalimin</h1>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Shkruani email-in tuaj dhe ne do t&apos;ju dërgojmë udhëzime për rivendosjen e fjalëkalimit.
              </p>
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Duke dërguar...</span></>
                ) : (
                  <><span>Dërgo Udhëzimet</span><ArrowRight className="size-4" /></>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="size-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Email-i u dërgua!</h2>
            <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
              Kemi dërguar udhëzime te <strong>{email}</strong>. Kontrolloni kutinë tuaj postare.
            </p>
          </div>
        )}

        <Link href="/login" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-6 transition-colors">
          <ArrowLeft className="size-4" />
          <span>Kthehu te Hyrja</span>
        </Link>
      </div>
    </div>
  )
}
