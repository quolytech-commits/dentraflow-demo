import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const today = new Date().toISOString().split('T')[0]

  const [
    totalPatients,
    patientsInTreatment,
    todayAppointments,
    pendingAppointments,
    completedAppointments,
    totalDoctors,
    payments,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({ where: { status: 'ne_trajtim' } }),
    prisma.appointment.count({ where: { date: today } }),
    prisma.appointment.count({ where: { status: 'ne_pritje' } }),
    prisma.appointment.count({ where: { status: 'perfunduar' } }),
    prisma.user.count({ where: { role: 'mjek' } }),
    prisma.payment.findMany({ select: { amount: true, status: true } }),
  ])

  const totalRevenue = payments
    .filter((p) => p.status === 'paguar')
    .reduce((s, p) => s + p.amount, 0)

  const totalBilled = payments.reduce((s, p) => s + p.amount, 0)
  const unpaidCount = payments.filter((p) => p.status === 'papaguar').length

  return NextResponse.json({
    totalPatients,
    patientsInTreatment,
    todayAppointments,
    pendingAppointments,
    completedAppointments,
    totalDoctors,
    totalRevenue,
    totalBilled,
    unpaidCount,
  })
}
