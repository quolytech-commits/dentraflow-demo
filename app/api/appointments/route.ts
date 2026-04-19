import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

function toUIAppointment(a: {
  id: string
  date: string
  time: string
  type: string
  status: string
  notes: string | null
  patient: { id: string; name: string }
  doctor: { id: string; name: string }
}) {
  return {
    id: a.id,
    patientName: a.patient.name,
    patientId: a.patient.id,
    doctorName: a.doctor.name,
    doctorId: a.doctor.id,
    date: a.date,
    time: a.time,
    type: a.type,
    status: a.status.replace(/_/g, '-'),
    notes: a.notes ?? '',
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const date = searchParams.get('date') ?? ''
  const doctorId = searchParams.get('doctorId') ?? ''
  const status = searchParams.get('status') ?? ''

  const where: Record<string, unknown> = {}

  if (session.role === 'mjek') {
    const doctor = await prisma.user.findUnique({ where: { email: session.email } })
    if (doctor) where.doctorId = doctor.id
  } else if (doctorId) {
    where.doctorId = doctorId
  }

  if (date) where.date = date
  if (status && status !== 'all') where.status = status.replace(/-/g, '_')

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: { select: { id: true, name: true } },
      doctor: { select: { id: true, name: true } },
    },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })

  return NextResponse.json(appointments.map(toUIAppointment))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  try {
    const body = await req.json()
    const { patientId, doctorId, date, time, type, notes } = body

    if (!patientId || !doctorId || !date || !time || !type) {
      return NextResponse.json({ error: 'Të gjitha fushat janë të detyrueshme.' }, { status: 400 })
    }

    // Check for double-booking
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date,
        time,
        status: { notIn: ['anuluar'] },
      },
    })

    if (conflict) {
      return NextResponse.json(
        { error: 'Mjeku ka tashmë një termin në këtë orë. Zgjidhni orë tjetër.' },
        { status: 409 }
      )
    }

    const appt = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date,
        time,
        type,
        notes: notes || null,
        status: 'ne_pritje',
      },
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
      },
    })

    // Update patient lastVisit
    await prisma.patient.update({
      where: { id: patientId },
      data: { lastVisit: new Date() },
    })

    return NextResponse.json(toUIAppointment(appt), { status: 201 })
  } catch (err) {
    console.error('[APPOINTMENTS POST]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm.' }, { status: 500 })
  }
}
