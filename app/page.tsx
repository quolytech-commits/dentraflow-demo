'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('dentraflow_user')
    if (stored) {
      try {
        const user = JSON.parse(stored)
        if (user.role === 'admin') router.replace('/dashboard/admin')
        else if (user.role === 'mjek') router.replace('/dashboard/mjek')
        else router.replace('/dashboard/recepsion')
        return
      } catch {
        sessionStorage.removeItem('dentraflow_user')
      }
    }
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="size-10 border-2 border-border border-t-accent rounded-full animate-spin" />
    </div>
  )
}
