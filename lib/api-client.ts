'use client'

// Generic fetcher for SWR
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gabim rrjeti' }))
    throw new Error(err.error ?? 'Gabim rrjeti')
  }
  return res.json()
}

// Typed API helpers
export const api = {
  async post<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Gabim serveri')
    return json
  },

  async put<T>(url: string, data: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Gabim serveri')
    return json
  },

  async del(url: string): Promise<void> {
    const res = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      throw new Error(json.error ?? 'Gabim serveri')
    }
  },
}

// Transform helpers: DB enums use underscores, UI uses hyphens
export function toUIStatus(s: string): string {
  return s.replace(/_/g, '-')
}

export function toDBStatus(s: string): string {
  return s.replace(/-/g, '_')
}
