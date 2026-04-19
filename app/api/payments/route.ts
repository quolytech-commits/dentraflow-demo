import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

function toUIPayment(p: {
  id: string
  amount: number
  status: string
  service: string
  createdAt: Date
  patient: { id: string; name: string }
}) {
  return {
    id: p.id,
    patientName: p.patient.name,
    patientId: p.patient.id,
    amount: p.amount,
    status: p.status.replace(/_/g, '-'),
    service: p.service,
    date: p.createdAt.toISOString().split('T')[0],
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') ?? ''
  const patientId = searchParams.get('patientId') ?? ''

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') where.status = status.replace(/-/g, '_')
  if (patientId) where.patientId = patientId

  const payments = await prisma.payment.findMany({
    where,
    include: { patient: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(payments.map(toUIPayment))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role === 'mjek') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  try {
    const body = await req.json()
    const { patientId, amount, service, status } = body

    if (!patientId || !amount || !service) {
      return NextResponse.json({ error: 'Pacienti, shuma dhe shërbimi janë të detyrueshme.' }, { status: 400 })
    }

    const payment = await prisma.payment.create({
      data: {
        patientId,
        amount: Number(amount),
        service,
        status: (status ?? 'papaguar').replace(/-/g, '_'),
      },
      include: { patient: { select: { id: true, name: true } } },
    })

    return NextResponse.json(toUIPayment(payment), { status: 201 })
  } catch (err) {
    console.error('[PAYMENTS POST]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm.' }, { status: 500 })
  }
}
