import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { id } = await params
  const body = await req.json()

  try {
    // Double-booking check when changing doctor/date/time
    if (body.doctorId && body.date && body.time) {
      const conflict = await prisma.appointment.findFirst({
        where: {
          doctorId: body.doctorId,
          date: body.date,
          time: body.time,
          status: { notIn: ['anuluar'] },
          id: { not: id },
        },
      })
      if (conflict) {
        return NextResponse.json(
          { error: 'Mjeku ka tashmë një termin në këtë orë.' },
          { status: 409 }
        )
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(body.patientId && { patientId: body.patientId }),
        ...(body.doctorId && { doctorId: body.doctorId }),
        ...(body.date && { date: body.date }),
        ...(body.time && { time: body.time }),
        ...(body.type && { type: body.type }),
        ...(body.status && { status: body.status.replace(/-/g, '_') }),
        ...(body.notes !== undefined && { notes: body.notes || null }),
      },
      include: {
        patient: { select: { id: true, name: true } },
        doctor: { select: { id: true, name: true } },
      },
    })

    return NextResponse.json({
      id: updated.id,
      patientName: updated.patient.name,
      patientId: updated.patient.id,
      doctorName: updated.doctor.name,
      doctorId: updated.doctor.id,
      date: updated.date,
      time: updated.time,
      type: updated.type,
      status: updated.status.replace(/_/g, '-'),
      notes: updated.notes ?? '',
    })
  } catch (err) {
    console.error('[APPOINTMENTS PUT]', err)
    return NextResponse.json({ error: 'Gabim gjatë përditësimit.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })

  const { id } = await params
  await prisma.appointment.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
