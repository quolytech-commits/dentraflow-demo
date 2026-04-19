import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const role = searchParams.get('role') ?? ''

  const where: Record<string, unknown> = {}
  if (role) where.role = role

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      specialty: true,
      createdAt: true,
      _count: {
        select: {
          patients: true,
          appointments: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar ?? u.name.slice(0, 2).toUpperCase(),
      specialty: u.specialty,
      patientCount: u._count.patients,
      appointmentCount: u._count.appointments,
    }))
  )
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role !== 'admin') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  try {
    const { name, email, password, role, specialty } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Të gjitha fushat janë të detyrueshme.' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return NextResponse.json({ error: 'Ky email është tashmë i regjistruar.' }, { status: 409 })
    }

    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        avatar: name.slice(0, 2).toUpperCase(),
        specialty: specialty || null,
      },
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      specialty: user.specialty,
    }, { status: 201 })
  } catch (err) {
    console.error('[USERS POST]', err)
    return NextResponse.json({ error: 'Gabim i brendshëm.' }, { status: 500 })
  }
}
