'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, MOCK_CREDENTIALS } from './mock-data'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('dentraflow_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        sessionStorage.removeItem('dentraflow_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800))
    const record = MOCK_CREDENTIALS[email.toLowerCase().trim()]
    if (!record) {
      setIsLoading(false)
      return { success: false, error: 'Email-i nuk u gjet në sistem.' }
    }
    if (record.password !== password) {
      setIsLoading(false)
      return { success: false, error: 'Fjalëkalimi është i gabuar.' }
    }
    setUser(record.user)
    sessionStorage.setItem('dentraflow_user', JSON.stringify(record.user))
    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('dentraflow_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
