import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role === 'mjek') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.payment.update({
    where: { id },
    data: {
      ...(body.status && { status: body.status.replace(/-/g, '_') }),
      ...(body.amount !== undefined && { amount: Number(body.amount) }),
      ...(body.service && { service: body.service }),
    },
    include: { patient: { select: { id: true, name: true } } },
  })

  return NextResponse.json({
    id: updated.id,
    patientName: updated.patient.name,
    patientId: updated.patient.id,
    amount: updated.amount,
    status: updated.status.replace(/_/g, '-'),
    service: updated.service,
    date: updated.createdAt.toISOString().split('T')[0],
  })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role !== 'admin') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  const { id } = await params
  await prisma.payment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
