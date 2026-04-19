import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role !== 'admin') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  const { id } = await params
  const body = await req.json()

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.specialty !== undefined && { specialty: body.specialty || null }),
      ...(body.role && { role: body.role }),
    },
  })

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    avatar: updated.avatar,
    specialty: updated.specialty,
  })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  if (session.role !== 'admin') return NextResponse.json({ error: 'Nuk keni akses.' }, { status: 403 })

  const { id } = await params

  // Prevent deleting yourself
  if (id === session.sub) {
    return NextResponse.json({ error: 'Nuk mund ta fshini llogarinë tuaj.' }, { status: 400 })
  }

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
