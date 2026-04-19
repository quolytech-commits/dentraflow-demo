import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const patientId = searchParams.get('patientId') ?? ''

  const where: Record<string, unknown> = {}
  if (patientId) where.patientId = patientId
  if (session.role === 'mjek') {
    const doctor = await prisma.user.findUnique({ where: { email: session.email } })
    if (doctor) where.doctorId = doctor.id
  }

  const treatments = await prisma.treatment.findMany({
    where,
    include: {
      patient: { select: { id: true, name: true } },
      doctor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    treatments.map((t) => ({
      id: t.id,
      patientName: t.patient.name,
      patientId: t.patient.id,
      doctorName: t.doctor.name,
      doctorId: t.doctor.id,
      description: t.description,
      cost: t.cost,
      createdAt: t.createdAt.toISOString().split('T')[0],
    }))
  )
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  try {
    const body = await req.json()
    const { patientId, doctorId, description, cost } = body

    if (!patientId || !doctorId || !description) {
      return NextResponse.json({ error: 'Pacienti, mjeku dhe përshkrimi janë të detyrueshme.' }, { status: 400 })
    }

    const treatment = await prisma.treatment.create({
      data: {
        patientId,
        doctorId,
        description,
        cost: cost ? Number(cost) : null,
      },
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({
      id: treatment.id,
      patientName: treatment.patient.name,
      patientId: treatment.patient.id,
      doctorName: treatment.doctor.name,
      doctorId: treatment.doctor.id,
      description: treatment.description,
      cost: treatment.cost,
      createdAt: treatment.createdAt.toISOString().split('T')[0],
    }, { status: 201 })
  } catch (err) {
    console.error('[TREATMENTS POST]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm.' }, { status: 500 })
  }
}
