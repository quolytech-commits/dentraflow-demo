import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Nuk jeni i autorizuar.' }, { status: 401 })
  }
  return NextResponse.json({
    id: session.sub,
    name: session.name,
    email: session.email,
    role: session.role,
    avatar: session.avatar,
    specialty: session.specialty,
  })
}
