import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { id } = await params
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      doctor: { select: { id: true, name: true } },
      treatments: { select: { id: true, description: true, cost: true, createdAt: true } },
      appointments: {
        include: { doctor: { select: { name: true } } },
        orderBy: { date: 'desc' },
      },
      payments: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!patient) return NextResponse.json({ error: 'Pacienti nuk u gjet.' }, { status: 404 })

  return NextResponse.json({
    id: patient.id,
    name: patient.name,
    age: patient.age ?? 0,
    phone: patient.phone ?? '',
    email: patient.email ?? '',
    status: patient.status.replace(/_/g, '-'),
    notes: patient.notes ?? '',
    medicalHistory: patient.medicalHistory,
    lastVisit: patient.lastVisit ? patient.lastVisit.toISOString().split('T')[0] : '',
    doctor: patient.doctor?.name ?? '',
    doctorId: patient.doctor?.id ?? null,
    treatments: patient.treatments.map((t) => t.description),
    appointments: patient.appointments.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      type: a.type,
      status: a.status.replace(/_/g, '-'),
      doctorName: a.doctor.name,
    })),
    payments: patient.payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status.replace(/_/g, '-'),
      service: p.service,
      date: p.createdAt.toISOString().split('T')[0],
    })),
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  try {
    const updated = await prisma.patient.update({
      where: { id },
      data: {
        name: body.name,
        age: body.age ? Number(body.age) : undefined,
        phone: body.phone ?? undefined,
        email: body.email ?? undefined,
        status: body.status ? body.status.replace(/-/g, '_') : undefined,
        notes: body.notes ?? undefined,
        medicalHistory: body.medicalHistory ?? undefined,
        doctorId: body.doctorId ?? undefined,
        lastVisit: body.lastVisit ? new Date(body.lastVisit) : undefined,
      },
      include: {
        doctor: { select: { id: true, name: true } },
        treatments: { select: { description: true } },
      },
    })

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      age: updated.age ?? 0,
      phone: updated.phone ?? '',
      email: updated.email ?? '',
      status: updated.status.replace(/_/g, '-'),
      notes: updated.notes ?? '',
      medicalHistory: updated.medicalHistory,
      lastVisit: updated.lastVisit ? updated.lastVisit.toISOString().split('T')[0] : '',
      doctor: updated.doctor?.name ?? '',
      doctorId: updated.doctor?.id ?? null,
      treatments: updated.treatments.map((t) => t.description),
    })
  } catch (err) {
    console.error('[PATIENTS PUT]', err)
    return NextResponse.json({ error: 'Gabim gjatë përditësimit.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role !== 'admin') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  const { id } = await params
  await prisma.patient.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
