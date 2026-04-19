// Type definitions — shared across the app
// Mock data has been removed; all data now comes from the real API.

export type { Role, User } from './auth-context'

export interface Patient {
  id: string
  name: string
  age: number
  phone: string
  email: string
  status: 'ne-pritje' | 'ne-trajtim' | 'perfunduar'
  lastVisit: string
  doctor: string
  doctorId?: string | null
  treatments: string[]
  notes: string
  medicalHistory: string[]
}

export interface Appointment {
  id: string
  patientName: string
  patientId?: string
  doctorName: string
  doctorId?: string
  date: string
  time: string
  type: string
  status: 'ne-pritje' | 'ne-trajtim' | 'perfunduar' | 'anuluar'
  notes?: string
}

export interface Payment {
  id: string
  patientName: string
  patientId?: string
  amount: number
  date: string
  status: 'paguar' | 'papaguar' | 'pjeserisht'
  service: string
}

export interface Doctor {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  specialty?: string
  patientCount?: number
}
