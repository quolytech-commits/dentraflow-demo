import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

function toUIPatient(p: {
  id: string
  name: string
  age: number | null
  phone: string | null
  email: string | null
  status: string
  notes: string | null
  medicalHistory: string[]
  lastVisit: Date | null
  doctor: { id: string; name: string } | null
  treatments: { description: string }[]
}) {
  return {
    id: p.id,
    name: p.name,
    age: p.age ?? 0,
    phone: p.phone ?? '',
    email: p.email ?? '',
    status: p.status.replace(/_/g, '-'),
    notes: p.notes ?? '',
    medicalHistory: p.medicalHistory,
    lastVisit: p.lastVisit ? p.lastVisit.toISOString().split('T')[0] : '',
    doctor: p.doctor?.name ?? '',
    doctorId: p.doctor?.id ?? null,
    treatments: p.treatments.map((t) => t.description),
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''
  const doctorId = searchParams.get('doctorId') ?? ''

  const where: Record<string, unknown> = {}

  // Doctors only see their own patients
  if (session.role === 'mjek') {
    const doctor = await prisma.user.findUnique({ where: { email: session.email } })
    if (doctor) where.doctorId = doctor.id
  } else if (doctorId) {
    where.doctorId = doctorId
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (status && status !== 'all') {
    where.status = status.replace(/-/g, '_')
  }

  const patients = await prisma.patient.findMany({
    where,
    include: {
      doctor: { select: { id: true, name: true } },
      treatments: { select: { description: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(patients.map(toUIPatient))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role === 'mjek') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  try {
    const body = await req.json()
    const { name, age, phone, email, status, notes, medicalHistory, doctorId } = body

    if (!name) return NextResponse.json({ error: 'Emri është i detyrueshëm.' }, { status: 400 })

    const patient = await prisma.patient.create({
      data: {
        name,
        age: age ? Number(age) : null,
        phone: phone || null,
        email: email || null,
        status: (status ?? 'ne-pritje').replace(/-/g, '_'),
        notes: notes || null,
        medicalHistory: medicalHistory ?? [],
        doctorId: doctorId || null,
      },
      include: {
        doctor: { select: { id: true, name: true } },
        treatments: { select: { description: true } },
      },
    })

    return NextResponse.json(toUIPatient(patient), { status: 201 })
  } catch (err) {
    console.error('[PATIENTS POST]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm.' }, { status: 500 })
  }
}
